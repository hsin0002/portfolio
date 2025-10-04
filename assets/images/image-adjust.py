from PIL import Image
import os


# 載入圖片
img1 = Image.open("images/NCUfresh2.png")
img2 = Image.open("images/NCUfresh3.png")

# 調整兩張圖高度一致（選擇 img1 高度）
img2 = img2.resize((int(img2.width * img1.height / img2.height), img1.height))

# 設定縫隙寬度
gap = 20  # pixels

# 計算合併後的寬度和高度
total_width = img1.width + img2.width + gap
total_height = img1.height

# 創建新圖，背景白色
new_img = Image.new("RGB", (total_width, total_height), (255, 255, 255))

# 將兩張圖貼上
new_img.paste(img1, (0, 0))
new_img.paste(img2, (img1.width + gap, 0))

# 儲存結果
new_img.save("merged_photo.png")
print("圖片已合併完成！")
