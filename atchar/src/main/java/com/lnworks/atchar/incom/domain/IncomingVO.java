package com.lnworks.atchar.incom.domain;

import com.lnworks.atchar.common.domain.CommonVO;
import com.lnworks.atchar.common.domain.FileUpDownVO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@ToString
public class IncomingVO extends CommonVO implements Serializable {
    private static final long serialVersionUID = 2369028936297651054L;

    private String incomcd;
    private String itemnm;
    private String itemcd;
    private String makenm;
    private String makecd;
    private String carnm;
    private String carcd;
    private String modelnm;
    private String modelcd;
    private String yearnm;
    private String yearcd;
    private String areasinm;
    private String areasicd;
    private String areagunm;
    private String areagucd;
    private String price;
    private String partnum;
    private String vinnum;
    private String memo;
    private String mountyn;
    private String coloryn;
    private String useyn;
    private String itgu;

    private List<FileUpDownVO> fileList;

    private String s_itemnm;
    private String allyn;
    private String mdopenyn;
}
