package com.lnworks.atchar.util;

import java.text.SimpleDateFormat;
import java.util.Calendar;

public final class DateTimeUtil {
    public static String getNowDate() {
        Calendar cal = Calendar.getInstance();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
        return sdf.format(cal.getTime());
    }

    public static String getNowDateHb(String sep) {
        if ( sep == null ) sep = "";
        Calendar cal = Calendar.getInstance();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy" + sep + "MM" + sep + "dd");
        return sdf.format(cal.getTime());
    }

    public static String getNowDateTime() {
        Calendar cal = Calendar.getInstance();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmssSSS");
        return sdf.format(cal.getTime());
    }
}
