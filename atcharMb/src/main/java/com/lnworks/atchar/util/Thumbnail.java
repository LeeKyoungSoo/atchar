package com.lnworks.atchar.util;

import org.imgscalr.Scalr;
import org.springframework.beans.factory.annotation.Value;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;

public class Thumbnail {
    /**
     * 썸네일을 생성합니다.
     * 240 x 240 크기의 썸네일을 만듭니다.
     */
    public void makeThumbnail(String filePath, String fileName, String fileExt) throws Exception {
        // 저장된 원본파일로부터 BufferedImage 객체를 생성합니다.
        BufferedImage srcImg = ImageIO.read(new File(filePath + File.separator + fileName));

        // 썸네일의 너비와 높이 입니다.
        int dw = 240, dh = 240;

        // 원본 이미지의 너비와 높이 입니다.
        int ow = srcImg.getWidth();
        int oh = srcImg.getHeight();

        // 원본 너비를 기준으로 하여 썸네일의 비율로 높이를 계산합니다.
        int nw = ow; int nh = (ow * dh) / dw;

        // 계산된 높이가 원본보다 높다면 crop이 안되므로
        // 원본 높이를 기준으로 썸네일의 비율로 너비를 계산합니다.
        if(nh > oh) {
            nw = (oh * dw) / dh;
            nh = oh;
        }

        // 계산된 크기로 원본이미지를 가운데에서 crop 합니다.
        BufferedImage cropImg = Scalr.crop(srcImg, (ow-nw)/2, (oh-nh)/2, nw, nh);

        // crop된 이미지로 썸네일을 생성합니다.
        BufferedImage destImg = Scalr.resize(cropImg, dw, dh);

        // 썸네일을 저장합니다. 이미지 이름 앞에 "THUMB_" 를 붙여 표시했습니다.
        String thumbName = filePath  + File.separator +  "thumb_" + fileName;
        File thumbFile = new File(thumbName);

        ImageIO.write(destImg, fileExt.toUpperCase(), thumbFile);
    }
}
