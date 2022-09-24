package com.lnworks.atchar.etcmng.domain;

import com.lnworks.atchar.common.domain.CommonVO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class BoardVO extends CommonVO {
    private String bId;
    private String gubun;
    private String subject;
    private String cont;
    private String regId;
    private String regNm;
    private String regDt;
    private String modDt;
    private String hit;
    private String notiYn;
    private String toDt;
    private String fromDt;
    private String placeNm;

    private List<com.lnworks.atchar.etcmng.domain.BoardFileVO> fileList;

    private String sSubject;
    private String sRegDt;
    private String eRegDt;
}
