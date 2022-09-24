package com.lnworks.atchar.etcmng.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class BoardFileVO {
    private int fId;
    private String bId;
    private String fileOrgNm;
    private String fileSaveNm;
    private String fileSize;
    private String regDt;
}
