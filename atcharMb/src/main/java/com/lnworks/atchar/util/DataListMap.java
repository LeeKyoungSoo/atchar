package com.lnworks.atchar.util;

import org.apache.commons.collections.map.ListOrderedMap;

public class DataListMap extends ListOrderedMap {
    private static final long serialVersionUID = 6723434363565852261L;

    public Object put(Object key, Object value) {
        return super.put(CamelUtil.convert2CamelCase((String) key), value);
    }
}



