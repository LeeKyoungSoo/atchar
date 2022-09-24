package com.lnworks.atchar.etcmng.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

@Getter
@Setter
@ToString
public class ZipCordVO implements Serializable {
    private static final long serialVersionUID = 3170208407428017766L;

    private String si;
    private String no;
    private String gu;
}
