package com.lnworks.atchar.security;

import org.apache.tomcat.util.codec.binary.Base64;

import java.security.MessageDigest;

public class CustomEncrypt {
    public static String encryptPassword(String password, String id) throws Exception {

        if (password == null) {
            return "";
        }

        byte[] hashValue = null; // 해쉬값

        MessageDigest md = MessageDigest.getInstance("SHA-256");

        md.reset();
        md.update(id.getBytes());

        password = (new StringBuffer(password)).reverse().toString();
        hashValue = md.digest(password.getBytes());

        return new String(Base64.encodeBase64(hashValue));
    }
}
