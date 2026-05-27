package com.ecommerce.common.util;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

public class OrderNumberGenerator {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyyMMdd");

    public static String generate(Long sequence) {
        String datePart = LocalDate.now(ZoneId.of("UTC")).format(DATE_FORMAT);
        return "ORD-" + datePart + "-" + String.format("%06d", sequence % 1_000_000);
    }
}
