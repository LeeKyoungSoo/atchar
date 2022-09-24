package com.lnworks.atchar.common.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CommonVO {
    private String pageSize;
    private String pageNum;
    private int limit;
    private int offSet;
    private int totalCount;

    private String regid;
    private String regdt;
    private String modid;
    private String moddt;

    private String searchValue;
    private String stdt;
    private String endt;
}
