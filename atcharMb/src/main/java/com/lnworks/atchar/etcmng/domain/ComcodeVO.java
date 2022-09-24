package com.lnworks.atchar.etcmng.domain;

import com.lnworks.atchar.common.domain.CommonVO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

@Getter
@Setter
@ToString
public class ComcodeVO extends CommonVO implements Serializable {
    private static final long serialVersionUID = -8591115664320359407L;

    private String comCd;
    private String mstCd;
    private String comNm;
    private String odNo;
    private String useYn;

    private String s_comCd;
    private String s_mstCd;
    private String s_comNm;
    private String s_odNo;
    private String s_useYn;
}

