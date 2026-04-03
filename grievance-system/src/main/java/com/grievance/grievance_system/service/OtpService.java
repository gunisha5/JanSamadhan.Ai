package com.grievance.grievance_system.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private static final Logger log = LoggerFactory.getLogger(OtpService.class);
    private static final int OTP_LENGTH = 6;
    private static final long OTP_VALID_MS = 5 * 60 * 1000; // 5 minutes

    private final Map<String, OtpEntry> store = new ConcurrentHashMap<>();
    private final SecureRandom random = new SecureRandom();

    public String generateAndStore(String email) {
        String otp = String.format("%0" + OTP_LENGTH + "d", random.nextInt((int) Math.pow(10, OTP_LENGTH)));
        store.put(email.toLowerCase(), new OtpEntry(otp, System.currentTimeMillis()));
        log.info("OTP for {} (dev): {}", email, otp);
        return otp;
    }

    public boolean verify(String email, String otp) {
        OtpEntry entry = store.get(email.toLowerCase());
        if (entry == null || !entry.otp.equals(otp)) return false;
        if (System.currentTimeMillis() - entry.createdAt > OTP_VALID_MS) {
            store.remove(email.toLowerCase());
            return false;
        }
        store.remove(email.toLowerCase());
        return true;
    }

    private record OtpEntry(String otp, long createdAt) {}
}
