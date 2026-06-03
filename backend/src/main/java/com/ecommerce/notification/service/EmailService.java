package com.ecommerce.notification.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@Slf4j
public class EmailService {

    private final RestTemplate restTemplate;
    private final String apiKey;
    private final String fromEmail;

    public EmailService(
        RestTemplate restTemplate,
        @Value("${resend.api-key:}") String apiKey,
        @Value("${email.from:noreply@dominio.com}") String fromEmail
    ) {
        this.restTemplate = restTemplate;
        this.apiKey = apiKey;
        this.fromEmail = fromEmail;
    }

    public void sendEmail(String to, String subject, String htmlBody) {
        if (apiKey.isEmpty()) {
            log.warn("Resend API key not configured. Skipping email to {}: {}", to, subject);
            return;
        }
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> body = Map.of(
                "from", fromEmail,
                "to", new String[]{to},
                "subject", subject,
                "html", htmlBody
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                "https://api.resend.com/emails", request, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("Email sent to {}: {}", to, subject);
            } else {
                log.warn("Failed to send email to {}: {} {}", to, response.getStatusCode(), response.getBody());
            }
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }

    public void sendOrderConfirmation(String to, String orderNumber, String customerName) {
        String subject = "Pedido " + orderNumber + " confirmado";
        String html = buildOrderEmailHtml(orderNumber, customerName, "confirmado",
            "Tu pedido ha sido confirmado y está siendo procesado.");
        sendEmail(to, subject, html);
    }

    public void sendOrderStatusUpdate(String to, String orderNumber, String customerName, String status) {
        String statusLabel = switch (status) {
            case "CONFIRMED" -> "confirmado";
            case "SHIPPED" -> "enviado";
            case "DELIVERED" -> "entregado";
            case "CANCELLED" -> "cancelado";
            default -> status.toLowerCase();
        };
        String subject = "Pedido " + orderNumber + " " + statusLabel;
        String message = "El estado de tu pedido " + orderNumber + " ha sido actualizado a: " + statusLabel + ".";
        String html = buildOrderEmailHtml(orderNumber, customerName, statusLabel, message);
        sendEmail(to, subject, html);
    }

    private String buildOrderEmailHtml(String orderNumber, String customerName, String statusLabel, String message) {
        return "<!DOCTYPE html>"
            + "<html><head><meta charset=\"utf-8\"></head>"
            + "<body style=\"font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 32px;\">"
            + "<div style=\"max-width: 560px; margin: 0 auto; background: white; border-radius: 16px; padding: 32px;\">"
            + "<h1 style=\"color: #1a3c34; font-size: 24px; margin: 0 0 8px;\">MAISON</h1>"
            + "<p style=\"color: #666; font-size: 14px;\">Hola " + customerName + ",</p>"
            + "<p style=\"color: #666; font-size: 14px;\">" + message + "</p>"
            + "<div style=\"background-color: #f0f7f4; border-radius: 8px; padding: 16px; margin: 16px 0;\">"
            + "<p style=\"margin: 0; font-size: 12px; color: #666;\">Número de pedido</p>"
            + "<p style=\"margin: 4px 0 0; font-size: 18px; font-weight: bold; color: #1a3c34;\">" + orderNumber + "</p>"
            + "</div>"
            + "<p style=\"color: #999; font-size: 12px; margin-top: 24px;\">"
            + "Si tienes alguna pregunta, contáctanos a través de nuestro sitio web.</p>"
            + "</div></body></html>";
    }
}
