package com.ecommerce.media.service;

import org.springframework.stereotype.Service;

@Service
public class S3Service {

    public String uploadFile(byte[] data, String fileName, String contentType) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    public void deleteFile(String key) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    public String getFileUrl(String key) {
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
