package com.lnworks.atchar.util;

import com.lnworks.atchar.common.domain.FileVO;
import org.apache.commons.collections.map.ListOrderedMap;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.lang.reflect.Array;
import java.util.HashMap;
import java.util.List;

public class BaseMap extends ListOrderedMap {
    protected final Logger log = LogManager.getLogger();

    private static final long serialVersionUID = 3642485397609857338L;

    public BaseMap() {
        super();
    }

    public BaseMap(@SuppressWarnings("rawtypes") HashMap map) {
        super(map);
    }

    public boolean getBoolean(Object key) {
        String value = getString(key);
        boolean isTrue = false;
        try {
            isTrue = Boolean.valueOf(value).booleanValue();
        } catch (RuntimeException e) {
            log.error("RuntimeException Error");
        }
        return isTrue;
    }

    public double getDouble(Object key) {
        return getDouble(key, 0.0d);
    }
    public double getDouble(Object key, double defaultValue) {
        String value = removeComma(getString(key));
        if (value.equals("")) {
            return defaultValue;
        }
        double num = 0.0d;
        try {
            num = Double.valueOf(value).doubleValue();
        } catch (RuntimeException e) {
            num = 0.0d;
        }
        return num;
    }

    public int getInt(Object key) {
        return getInt(key, 0);
    }
    public int getInt(Object key, int defaultValue) {
        long value = getLong(key, defaultValue);
        return (int) value;
    }

    public long getLong(Object key) {
        return getLong(key, 0L);
    }

    public long getLong(Object key, long defaultValue) {
        String value = removeComma(getString(key));
        if (value.equals("")) {
            return defaultValue;
        }
        long num = 0L;
        try {
            num = Long.valueOf(value).longValue();
        } catch (RuntimeException e) {
            num = 0L;
        }
        return num;
    }

    public String getString(Object key) {
        return getString(key, "");
    }
    public String getString(Object key, String defaultValue) {
        String value = null;
        try {
            Object o = super.get(key);
            if (o == null) {
                value = defaultValue;
            } else {
                Class<?> c = o.getClass();
                if (c.isArray()) {
                    int length = Array.getLength(o);
                    if (length == 0) {
                        value = "";
                    } else {
                        Object item = Array.get(o, 0);
                        if (item == null) {
                            value = "";
                        } else {
                            value = item.toString();
                        }
                    }
                } else {
                    value = o.toString();
                }
            }
        } catch (RuntimeException e) {
            value = "";
        }
        return value;

    }

    public List<?> getList(Object key) {
        return (List<?>) get(key);
    }

    /**
     * 업로드된 파일 정보를 가져온다.
     * @parameter map
     * @return
     */
    @SuppressWarnings("unchecked")
    public List<FileVO> getFileInfo() {
        return (List<FileVO>)this.get("_FILE_INFO");
    }

    private String removeComma(String s) {
        if (s == null) {
            return null;
        }
        if (s.indexOf(',') != -1) {
            StringBuffer buf = new StringBuffer();
            for (int i = 0; i < s.length(); i++) {
                char c = s.charAt(i);
                if (c != ',') {
                    buf.append(c);
                }
            }
            return buf.toString();
        }
        return s;
    }
}
