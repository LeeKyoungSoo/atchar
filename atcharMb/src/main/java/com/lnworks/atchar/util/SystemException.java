package com.lnworks.atchar.util;

public class SystemException extends RuntimeException {
    private static final long serialVersionUID = -2265068679956771345L;

    public SystemException() {
        super();
    }

    public SystemException(Throwable cause) {
        super(cause);
    }

    public SystemException(String message, Throwable cause) {
        super(message, cause);
    }
}

