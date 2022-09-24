package com.lnworks.atchar.common.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class FileUpDownVO {
    private int fId;
    private String bId;
    private String fileOrgNm;
    private String fileSaveNm;
    private String fileSize;
    private String regDt;
    private String f_bId;
}
