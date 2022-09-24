package com.lnworks.atchar.incom.domain;

import com.lnworks.atchar.common.domain.CommonVO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

@Getter
@Setter
@ToString
public class MyItemVO extends CommonVO implements Serializable {
    private static final long serialVersionUID = 516037401990842255L;

    private String incomcd;
    private String clickcnt;
}
