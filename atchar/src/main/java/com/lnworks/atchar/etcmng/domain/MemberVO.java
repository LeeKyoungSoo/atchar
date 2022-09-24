package com.lnworks.atchar.etcmng.domain;

import com.lnworks.atchar.common.domain.CommonVO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

@Getter
@Setter
@ToString
public class MemberVO extends CommonVO implements Serializable {
    private static final long serialVersionUID = -1849687503516681029L;

    private String userId;
    private String pwd;
    private String newPwd;
    private String userNm;
    private String level;
    private String useYn;

    private String phone;
    private String email;
    private String regroot;
    private String memo;

    private String s_userId;
    private String s_userNm;
    private String s_level;
    private String s_useYn;
}
