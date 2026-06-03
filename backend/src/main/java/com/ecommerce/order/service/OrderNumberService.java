package com.ecommerce.order.service;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class OrderNumberService {

    private final JdbcTemplate jdbcTemplate;

    public String generateOrderNumber() {
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        Long seq = jdbcTemplate.queryForObject("SELECT NEXTVAL('order_seq')", Long.class);
        return String.format("ORD-%s-%06d", datePart, seq);
    }
}
