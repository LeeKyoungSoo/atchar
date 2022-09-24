package com.lnworks.atchar.util;


import lombok.AllArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class MailSend {
    private JavaMailSender mailSender;
    private static final String FROM_ADDRESS = "ilovebasic@gmail.com";

    public void SendEmail(String mailAddress, String mailTitle, String mailCont)  {
        String msgboxFront = "<center><table width='400' height='100' cellpadding='0' cellspacing='1' bgcolor='#004c8e'><tr><td bgcolor='#e0e0e5' height='30' align='center'>" +
                "<span style='color:#004c8e;font-size:16px;'>raphaelsv - 신규 비밀번호 발급</span></td></tr><tr><td bgcolor='#e0e0e5' height='70' align='center'>" +
                "<span style='color:#fa6a23;font-size:16px;font-weight:600'>";
        String msgboxTail = "</span></td></tr></table></center>";

        try {
            MailHandler message = new MailHandler(mailSender);
            message.setTo(mailAddress);
            message.setFrom(FROM_ADDRESS);
            message.setSubject(mailTitle);
            message.setText(msgboxFront + mailCont + msgboxTail, true);

            message.send();
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }
}
