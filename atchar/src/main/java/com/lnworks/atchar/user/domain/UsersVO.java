package com.lnworks.atchar.user.domain;

import com.lnworks.atchar.common.domain.CommonVO;
import com.lnworks.atchar.common.domain.MemberRole;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@ToString
public class UsersVO extends CommonVO implements Serializable {
    private static final long serialVersionUID = -8274004534207618049L;

    private String userid;
    private String pwd;
    private String usernm;
    private String level;
    private String useyn;

    private List<MemberRole> roleList;
}
