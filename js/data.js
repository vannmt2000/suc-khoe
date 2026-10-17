// ========== FOOD DATABASE ==========
const FOOD_DB=[
  // ===== CƠM & XÔI =====
  {n:'Cơm trắng (1 chén)',c:200,t:'yellow',u:'chén',alt:['cơm','cơm tẻ']},
  {n:'Cơm trắng (1 chén nhỏ)',c:130,t:'yellow',u:'chén nhỏ'},
  {n:'Cơm gạo lứt (1 chén)',c:180,t:'green',u:'chén',alt:['gạo lứt','cơm lứt']},
  {n:'Cơm gạo lứt (1 chén nhỏ)',c:130,t:'green',u:'chén nhỏ'},
  {n:'Cơm chiên trứng (1 chén)',c:280,t:'yellow',u:'chén',alt:['cơm rang trứng']},
  {n:'Cơm chiên hải sản (1 chén)',c:250,t:'yellow',u:'chén',alt:['cơm rang hải sản']},
  {n:'Cơm chiên dương châu (1 chén)',c:270,t:'yellow',u:'chén'},
  {n:'Cơm chiên gà (1 chén)',c:280,t:'yellow',u:'chén'},
  {n:'Cơm chiên cá mặn (1 chén)',c:290,t:'yellow',u:'chén'},
  {n:'Cơm rang dưa bò (1 chén)',c:280,t:'yellow',u:'chén'},
  {n:'Cơm hến Huế (1 chén)',c:250,t:'green',u:'chén',alt:['cơm hến']},
  {n:'Cơm lam (1 ống)',c:220,t:'yellow',u:'ống'},
  {n:'Cơm cuộn rong biển (1 cuộn)',c:180,t:'green',u:'cuộn',alt:['kimbap','gimbap']},
  {n:'Cơm nắm onigiri (1 cái)',c:180,t:'yellow',u:'cái',alt:['onigiri']},
  {n:'Cơm cháy chà bông (100g)',c:420,t:'red',u:'100g'},
  {n:'Xôi mặn (1 gói)',c:450,t:'yellow',u:'gói',alt:['xôi']},
  {n:'Xôi gấc (1 gói)',c:400,t:'yellow',u:'gói'},
  {n:'Xôi đậu xanh (1 gói)',c:380,t:'yellow',u:'gói'},
  {n:'Xôi xéo (1 gói)',c:420,t:'yellow',u:'gói'},
  {n:'Xôi gà (1 gói)',c:500,t:'yellow',u:'gói'},

  // ===== PHỞ / BÚN / MÌ / MIẾN =====
  {n:'Phở bò (1 tô nhỏ)',c:300,t:'yellow',u:'tô nhỏ',alt:['phở bò ít']},
  {n:'Phở gà (1 tô)',c:400,t:'yellow',u:'tô',alt:['pho ga']},
  {n:'Phở gà (1 tô nhỏ)',c:280,t:'yellow',u:'tô nhỏ'},
  {n:'Phở cá (1 tô)',c:350,t:'green',u:'tô'},
  {n:'Phở trộn (1 tô)',c:500,t:'yellow',u:'tô'},
  {n:'Phở chay (1 tô)',c:300,t:'green',u:'tô'},
  {n:'Phở cuốn (1 cuốn)',c:80,t:'green',u:'cuốn'},
  {n:'Bún bò Huế (1 tô nhỏ)',c:320,t:'yellow',u:'tô nhỏ'},
  {n:'Bún chả cá (1 tô)',c:420,t:'yellow',u:'tô'},
  {n:'Bún riêu cua (1 tô)',c:400,t:'yellow',u:'tô',alt:['bún riêu']},
  {n:'Bún riêu ốc (1 tô)',c:420,t:'yellow',u:'tô'},
  {n:'Bún mọc (1 tô)',c:380,t:'yellow',u:'tô'},
  {n:'Bún thang (1 tô)',c:380,t:'yellow',u:'tô'},
  {n:'Bún thịt nướng (1 tô)',c:450,t:'yellow',u:'tô',alt:['bún thịt']},
  {n:'Bún nem nướng (1 tô)',c:480,t:'yellow',u:'tô'},
  {n:'Bún ốc (1 tô)',c:350,t:'yellow',u:'tô'},
  {n:'Bún cá (1 tô)',c:400,t:'yellow',u:'tô'},
  {n:'Bún cá rô đồng (1 tô)',c:420,t:'yellow',u:'tô'},
  {n:'Bún mắm (1 tô)',c:450,t:'yellow',u:'tô',alt:['bún nước lèo']},
  {n:'Bún suông (1 tô)',c:420,t:'yellow',u:'tô'},
  {n:'Bún kèn (1 tô)',c:400,t:'yellow',u:'tô'},
  {n:'Bún quậy (1 tô)',c:380,t:'yellow',u:'tô'},
  {n:'Bún bì (1 tô)',c:450,t:'yellow',u:'tô'},
  {n:'Bún trộn (1 tô)',c:400,t:'yellow',u:'tô'},
  {n:'Bún xào (1 dĩa)',c:450,t:'yellow',u:'dĩa'},
  {n:'Bún chả (1 suất)',c:500,t:'yellow',u:'suất',alt:['bún chả Hà Nội']},
  {n:'Bún đậu mắm tôm (1 suất)',c:600,t:'red',u:'suất',alt:['bún đậu']},
  {n:'Hủ tiếu Nam Vang (1 tô)',c:420,t:'yellow',u:'tô',alt:['hủ tiếu']},
  {n:'Hủ tiếu Mỹ Tho (1 tô)',c:400,t:'yellow',u:'tô'},
  {n:'Hủ tiếu khô (1 tô)',c:450,t:'yellow',u:'tô'},
  {n:'Mì Quảng (1 tô)',c:450,t:'yellow',u:'tô'},
  {n:'Mì Quảng ếch (1 tô)',c:480,t:'yellow',u:'tô'},
  {n:'Cao lầu (1 tô)',c:430,t:'yellow',u:'tô'},
  {n:'Bánh canh cua (1 tô)',c:400,t:'yellow',u:'tô',alt:['bánh canh']},
  {n:'Bánh canh ghẹ (1 tô)',c:420,t:'yellow',u:'tô'},
  {n:'Bánh canh cá lóc (1 tô)',c:380,t:'yellow',u:'tô'},
  {n:'Bánh canh tôm (1 tô)',c:400,t:'yellow',u:'tô'},
  {n:'Bánh đa cua (1 tô)',c:380,t:'yellow',u:'tô'},
  {n:'Miến gà (1 tô)',c:320,t:'yellow',u:'tô',alt:['miến']},
  {n:'Miến cua (1 tô)',c:350,t:'yellow',u:'tô'},
  {n:'Miến trộn (1 tô)',c:400,t:'yellow',u:'tô'},
  {n:'Miến xào (1 dĩa)',c:450,t:'yellow',u:'dĩa'},
  {n:'Mì gói (1 gói)',c:350,t:'red',u:'gói',alt:['mì ăn liền','mì tôm']},
  {n:'Mì gói trộn (1 gói)',c:400,t:'red',u:'gói'},
  {n:'Mì xào bò (1 dĩa)',c:500,t:'yellow',u:'dĩa'},
  {n:'Mì xào hải sản (1 dĩa)',c:520,t:'yellow',u:'dĩa'},
  {n:'Mì xào giòn (1 dĩa)',c:600,t:'red',u:'dĩa'},
  {n:'Mì Ý sốt bò bằm (1 dĩa)',c:550,t:'yellow',u:'dĩa',alt:['spaghetti']},
  {n:'Mì Ý sốt kem (1 dĩa)',c:600,t:'red',u:'dĩa'},
  {n:'Ramen Nhật (1 tô)',c:500,t:'yellow',u:'tô',alt:['mì Nhật']},
  {n:'Udon (1 tô)',c:400,t:'yellow',u:'tô'},
  {n:'Soba (1 tô)',c:380,t:'yellow',u:'tô'},
  {n:'Mì vịt tiềm (1 tô)',c:500,t:'yellow',u:'tô'},
  {n:'Mì cay Hàn (1 tô)',c:550,t:'red',u:'tô',alt:['mì cay']},

  // ===== BÁNH MÌ =====
  {n:'Bánh mì que (1 cái)',c:150,t:'yellow',u:'cái',alt:['bánh mì que pate']},
  {n:'Bánh mì nguyên cám (1 lát)',c:80,t:'green',u:'lát',alt:['bánh mì đen']},
  {n:'Bánh mì trắng (1 lát)',c:75,t:'yellow',u:'lát',alt:['bánh mì sandwich']},
  {n:'Sandwich kẹp thịt (1 cái)',c:400,t:'yellow',u:'cái',alt:['sandwich']},

  // ===== BÁNH VN =====
  {n:'Bánh cuốn (1 suất)',c:300,t:'yellow',u:'suất'},
  {n:'Bánh ướt chả lụa (1 suất)',c:250,t:'yellow',u:'suất',alt:['bánh ướt']},
  {n:'Bánh xèo (1 cái)',c:350,t:'yellow',u:'cái'},
  {n:'Bánh khọt (5 cái)',c:280,t:'yellow',u:'5 cái'},
  {n:'Bánh căn (5 cái)',c:250,t:'yellow',u:'5 cái'},
  {n:'Bánh bèo (5 chén)',c:200,t:'green',u:'5 chén'},
  {n:'Bánh nậm (5 cái)',c:220,t:'yellow',u:'5 cái'},
  {n:'Bánh bột lọc (5 cái)',c:250,t:'yellow',u:'5 cái',alt:['bánh lọc']},
  {n:'Bánh giò (1 cái)',c:250,t:'yellow',u:'cái'},
  {n:'Bánh chưng (1 miếng)',c:400,t:'yellow',u:'miếng'},
  {n:'Bánh tét (1 miếng)',c:380,t:'yellow',u:'miếng'},
  {n:'Bánh ú (1 cái)',c:300,t:'yellow',u:'cái'},
  {n:'Bánh tầm bì (1 dĩa)',c:400,t:'yellow',u:'dĩa'},
  {n:'Bánh đúc (1 miếng)',c:180,t:'yellow',u:'miếng',alt:['bánh đúc nóng']},
  {n:'Bánh bò (1 miếng)',c:200,t:'red',u:'miếng'},
  {n:'Bánh da lợn (1 miếng)',c:180,t:'red',u:'miếng'},
  {n:'Bánh flan (1 cái)',c:180,t:'red',u:'cái',alt:['bánh caramen']},
  {n:'Bánh tiêu (1 cái)',c:180,t:'red',u:'cái'},
  {n:'Bánh cam (1 cái)',c:200,t:'red',u:'cái'},
  {n:'Bánh tráng trộn (1 gói)',c:250,t:'red',u:'gói',alt:['bánh tráng']},
  {n:'Bánh tráng nướng (1 cái)',c:200,t:'yellow',u:'cái',alt:['bánh tráng nướng']},
  {n:'Bánh tráng cuốn (1 cuốn)',c:100,t:'green',u:'cuốn'},

  // ===== CHÁO & SÚP =====
  {n:'Cháo trắng (1 tô)',c:150,t:'green',u:'tô',alt:['cháo hoa']},
  {n:'Cháo thịt bằm (1 tô)',c:250,t:'yellow',u:'tô',alt:['cháo thịt']},
  {n:'Cháo gà (1 tô)',c:280,t:'yellow',u:'tô'},
  {n:'Cháo cá (1 tô)',c:250,t:'yellow',u:'tô',alt:['cháo cá lóc']},
  {n:'Cháo tôm (1 tô)',c:270,t:'yellow',u:'tô'},
  {n:'Cháo lòng (1 tô)',c:350,t:'red',u:'tô'},
  {n:'Cháo sườn (1 tô)',c:320,t:'yellow',u:'tô'},
  {n:'Cháo vịt (1 tô)',c:350,t:'yellow',u:'tô'},
  {n:'Cháo đậu xanh (1 tô)',c:200,t:'green',u:'tô'},
  {n:'Cháo yến mạch (1 tô)',c:180,t:'green',u:'tô'},
  {n:'Súp gà (1 tô)',c:200,t:'green',u:'tô'},
  {n:'Súp cua (1 tô)',c:220,t:'yellow',u:'tô'},
  {n:'Súp măng cua (1 tô)',c:200,t:'yellow',u:'tô'},
  {n:'Súp tôm (1 tô)',c:180,t:'green',u:'tô'},

  // ===== KHO =====
  {n:'Thịt kho trứng (1 chén)',c:400,t:'yellow',u:'chén',alt:['thịt kho hột vịt']},
  {n:'Thịt kho tiêu (1 chén)',c:350,t:'yellow',u:'chén'},
  {n:'Thịt heo nạc luộc (100g)',c:145,t:'green',u:'100g',alt:['thịt luộc']},
  {n:'Thịt heo ba chỉ (100g)',c:260,t:'yellow',u:'100g',alt:['thịt ba chỉ']},
  {n:'Thịt heo quay (100g)',c:300,t:'red',u:'100g',alt:['heo quay']},
  {n:'Thịt xá xíu (100g)',c:220,t:'yellow',u:'100g',alt:['xá xíu']},
  {n:'Cá basa kho (100g)',c:120,t:'green',u:'100g'},
  {n:'Cá lóc kho tộ (100g)',c:170,t:'green',u:'100g',alt:['cá lóc kho']},
  {n:'Cá thu kho (100g)',c:200,t:'green',u:'100g'},
  {n:'Cá nục kho (100g)',c:170,t:'green',u:'100g',alt:['cá nục']},
  {n:'Cá hú kho (100g)',c:150,t:'green',u:'100g'},
  {n:'Cá rô kho (100g)',c:160,t:'green',u:'100g'},
  {n:'Cá trê kho (100g)',c:180,t:'green',u:'100g'},
  {n:'Cá cơm kho (1 chén nhỏ)',c:150,t:'green',u:'chén nhỏ',alt:['cá cơm']},
  {n:'Gà kho gừng (1 chén)',c:280,t:'green',u:'chén',alt:['gà kho']},
  {n:'Gà kho sả (1 chén)',c:300,t:'green',u:'chén'},
  {n:'Gà kho nước dừa (1 chén)',c:320,t:'yellow',u:'chén'},
  {n:'Tôm kho (100g)',c:150,t:'green',u:'100g'},
  {n:'Tôm rim (100g)',c:180,t:'green',u:'100g'},
  {n:'Mực kho (100g)',c:150,t:'green',u:'100g'},
  {n:'Rim tôm thịt (1 chén)',c:280,t:'yellow',u:'chén'},

  // ===== XÀO =====
  {n:'Rau muống xào tỏi (1 dĩa)',c:100,t:'green',u:'dĩa',alt:['rau muống xào']},
  {n:'Bông cải xào (1 dĩa)',c:120,t:'green',u:'dĩa'},
  {n:'Cải thìa xào (1 dĩa)',c:100,t:'green',u:'dĩa',alt:['cải ngọt xào']},
  {n:'Măng xào (1 dĩa)',c:150,t:'green',u:'dĩa'},
  {n:'Đậu que xào (1 dĩa)',c:140,t:'green',u:'dĩa',alt:['đậu que']},
  {n:'Nấm xào (1 dĩa)',c:120,t:'green',u:'dĩa'},
  {n:'Bầu xào (1 dĩa)',c:100,t:'green',u:'dĩa'},
  {n:'Bí xào (1 dĩa)',c:110,t:'green',u:'dĩa',alt:['bí đao xào']},
  {n:'Sò điệp xào (1 dĩa)',c:180,t:'green',u:'dĩa'},
  {n:'Mực xào (1 dĩa)',c:180,t:'green',u:'dĩa'},
  {n:'Tôm xào (1 dĩa)',c:200,t:'green',u:'dĩa'},
  {n:'Bò xào (1 dĩa)',c:280,t:'green',u:'dĩa'},
  {n:'Bò xào cần tây (1 dĩa)',c:300,t:'green',u:'dĩa'},
  {n:'Bò lúc lắc (1 dĩa)',c:400,t:'yellow',u:'dĩa'},
  {n:'Rau củ xào thập cẩm (1 dĩa)',c:150,t:'green',u:'dĩa'},

  // ===== HẤP =====
  {n:'Cá hấp (100g)',c:100,t:'green',u:'100g',alt:['cá hấp xì dầu']},
  {n:'Cá hồi hấp (100g)',c:180,t:'green',u:'100g'},
  {n:'Tôm hấp (100g)',c:99,t:'green',u:'100g',alt:['tôm luộc']},
  {n:'Mực hấp (100g)',c:90,t:'green',u:'100g',alt:['mực luộc']},
  {n:'Ghẹ hấp (100g)',c:90,t:'green',u:'100g',alt:['ghẹ luộc']},
  {n:'Nghêu hấp (100g)',c:60,t:'green',u:'100g',alt:['nghêu luộc']},
  {n:'Sò huyết (100g)',c:90,t:'green',u:'100g'},
  {n:'Gà hấp lá chanh (100g)',c:180,t:'green',u:'100g',alt:['gà hấp']},
  {n:'Vịt hấp (100g)',c:240,t:'yellow',u:'100g'},
  {n:'Đậu que luộc (100g)',c:30,t:'green',u:'100g',alt:['đậu que luộc']},
  {n:'Su su luộc (100g)',c:19,t:'green',u:'100g',alt:['su su hấp']},
  {n:'Bí đao luộc (100g)',c:12,t:'green',u:'100g'},
  {n:'Bông cải luộc (100g)',c:34,t:'green',u:'100g',alt:['súp lơ luộc']},
  {n:'Cải thìa luộc (100g)',c:15,t:'green',u:'100g',alt:['cải ngọt luộc']},
  {n:'Rau muống luộc (100g)',c:20,t:'green',u:'100g'},
  {n:'Đậu bắp luộc (100g)',c:30,t:'green',u:'100g',alt:['đậu bắp']},
  {n:'Cà rốt luộc (100g)',c:41,t:'green',u:'100g'},

  // ===== CANH =====
  {n:'Canh rau muống (1 tô)',c:35,t:'green',u:'tô'},
  {n:'Canh mồng tơi (1 tô)',c:35,t:'green',u:'tô'},
  {n:'Canh bí đao (1 tô)',c:40,t:'green',u:'tô',alt:['canh bí']},
  {n:'Canh bầu (1 tô)',c:40,t:'green',u:'tô'},
  {n:'Canh mướp (1 tô)',c:40,t:'green',u:'tô'},
  {n:'Canh cải thảo (1 tô)',c:40,t:'green',u:'tô'},
  {n:'Canh rong biển (1 tô)',c:50,t:'green',u:'tô',alt:['canh rong biển thịt']},
  {n:'Canh tần ô (1 tô)',c:40,t:'green',u:'tô',alt:['canh rau tần ô']},
  {n:'Canh đu đủ (1 tô)',c:60,t:'green',u:'tô'},
  {n:'Canh bồ ngót (1 tô)',c:40,t:'green',u:'tô',alt:['canh bồ ngót thịt bằm']},
  {n:'Canh bồ ngót nấu tôm khô (1 tô)',c:80,t:'green',u:'tô'},
  {n:'Canh chua cá (1 tô)',c:120,t:'green',u:'tô',alt:['canh chua cá lóc']},
  {n:'Canh chua cá basa (1 tô)',c:130,t:'green',u:'tô'},
  {n:'Canh chua lá giang (1 tô)',c:100,t:'green',u:'tô'},
  {n:'Canh chua tôm (1 tô)',c:130,t:'green',u:'tô'},
  {n:'Canh chua me (1 tô)',c:100,t:'green',u:'tô'},
  {n:'Canh chua thơm cá (1 tô)',c:130,t:'green',u:'tô'},
  {n:'Canh khổ qua nhồi thịt (1 tô)',c:180,t:'yellow',u:'tô',alt:['canh khổ qua']},
  {n:'Canh hến (1 tô)',c:100,t:'green',u:'tô',alt:['canh hến nấu chua']},
  {n:'Canh riêu cua (1 tô)',c:120,t:'green',u:'tô'},
  {n:'Canh cua rau đay (1 tô)',c:100,t:'green',u:'tô',alt:['canh cua']},
  {n:'Canh cua mồng tơi (1 tô)',c:100,t:'green',u:'tô'},
  {n:'Canh cua tôm (1 tô)',c:130,t:'green',u:'tô'},
  {n:'Canh thịt bằm (1 tô)',c:120,t:'green',u:'tô'},
  {n:'Canh sườn non (1 tô)',c:150,t:'green',u:'tô',alt:['canh sườn']},
  {n:'Canh gà (1 tô)',c:150,t:'green',u:'tô'},
  {n:'Canh tôm khô (1 tô)',c:100,t:'green',u:'tô'},
  {n:'Canh khoai mỡ (1 tô)',c:120,t:'green',u:'tô'},
  {n:'Canh khoai tây (1 tô)',c:130,t:'green',u:'tô'},
  {n:'Canh cà chua trứng (1 tô)',c:100,t:'green',u:'tô'},
  {n:'Canh tôm bí (1 tô)',c:110,t:'green',u:'tô'},
  {n:'Canh mướp tôm (1 tô)',c:110,t:'green',u:'tô'},

  // ===== NƯỚNG & CHIÊN =====
  {n:'Gà nướng (100g)',c:190,t:'green',u:'100g',alt:['gà nướng muối ớt']},
  {n:'Gà nướng mật ong (100g)',c:230,t:'yellow',u:'100g'},
  {n:'Gà nướng sả (100g)',c:200,t:'green',u:'100g'},
  {n:'Cánh gà chiên nước mắm (1 cánh)',c:180,t:'red',u:'cánh',alt:['cánh gà chiên']},
  {n:'Đùi gà chiên (1 cái)',c:280,t:'red',u:'cái'},
  {n:'Gà rán (1 miếng)',c:300,t:'red',u:'miếng',alt:['gà chiên']},
  {n:'Gà rán giòn (1 miếng)',c:320,t:'red',u:'miếng'},
  {n:'Cá hồi áp chảo (100g)',c:208,t:'green',u:'100g',alt:['cá hồi']},
  {n:'Cá basa chiên (100g)',c:220,t:'yellow',u:'100g'},
  {n:'Cá thu nướng (100g)',c:205,t:'green',u:'100g',alt:['cá thu']},
  {n:'Cá lóc nướng (100g)',c:150,t:'green',u:'100g',alt:['cá lóc nướng trui']},
  {n:'Cá rô chiên (100g)',c:250,t:'yellow',u:'100g'},
  {n:'Cá cơm chiên giòn (100g)',c:280,t:'yellow',u:'100g'},
  {n:'Tôm rang muối (100g)',c:180,t:'yellow',u:'100g'},
  {n:'Tôm chiên bột (100g)',c:280,t:'red',u:'100g',alt:['tôm tempura']},
  {n:'Tôm nướng (100g)',c:130,t:'green',u:'100g'},
  {n:'Mực chiên giòn (100g)',c:280,t:'red',u:'100g'},
  {n:'Mực nướng (100g)',c:120,t:'green',u:'100g'},
  {n:'Mực xào chua ngọt (1 dĩa)',c:200,t:'green',u:'dĩa'},
  {n:'Thịt nướng (100g)',c:250,t:'yellow',u:'100g'},
  {n:'Thịt xiên nướng (1 xiên)',c:120,t:'yellow',u:'xiên'},
  {n:'Bò lá lốt (1 cuốn)',c:100,t:'yellow',u:'cuốn',alt:['bò nướng lá lốt']},
  {n:'Chả lá lốt (1 cuốn)',c:80,t:'yellow',u:'cuốn'},
  {n:'Nem nướng (100g)',c:280,t:'yellow',u:'100g'},
  {n:'Chả lụa (100g)',c:230,t:'yellow',u:'100g',alt:['chả']},
  {n:'Chả cá thác lác (100g)',c:200,t:'yellow',u:'100g',alt:['chả cá']},
  {n:'Chả chiên (100g)',c:280,t:'yellow',u:'100g'},
  {n:'Chả giò chiên (1 cái)',c:120,t:'red',u:'cái',alt:['nem rán','chả ram']},
  {n:'Nem cuốn (1 cuốn)',c:120,t:'yellow',u:'cuốn'},
  {n:'Xúc xích heo (1 cây)',c:150,t:'red',u:'cây',alt:['xúc xích']},
  {n:'Xúc xích Đức (1 cây)',c:180,t:'red',u:'cây'},
  {n:'Lạp xưởng (1 cây)',c:200,t:'red',u:'cây'},
  {n:'Thịt xông khói (2 lát)',c:90,t:'red',u:'2 lát',alt:['bacon']},
  {n:'Pate gan (1 thìa)',c:80,t:'yellow',u:'thìa',alt:['pate']},
  {n:'Trứng vịt lộn (1 quả)',c:180,t:'yellow',u:'quả',alt:['hột vịt lộn']},
  {n:'Trứng cút lộn (5 quả)',c:150,t:'yellow',u:'5 quả'},

  // ===== TRỨNG =====
  {n:'Trứng luộc (1 quả)',c:78,t:'green',u:'quả',alt:['trứng gà luộc']},
  {n:'Trứng ốp la (1 quả)',c:120,t:'yellow',u:'quả',alt:['trứng ốp']},
  {n:'Trứng chiên (1 quả)',c:120,t:'yellow',u:'quả',alt:['trứng rán']},
  {n:'Trứng hấp (1 chén)',c:100,t:'green',u:'chén',alt:['trứng hấp thịt']},
  {n:'Trứng kho (1 quả)',c:120,t:'yellow',u:'quả'},
  {n:'Trứng cút luộc (1 quả)',c:15,t:'green',u:'quả'},
  {n:'Trứng cút chiên (1 quả)',c:25,t:'yellow',u:'quả'},

  // ===== ĐẬU HŨ =====
  {n:'Đậu hũ trắng (100g)',c:80,t:'green',u:'100g',alt:['đậu phụ']},
  {n:'Đậu hũ chiên (100g)',c:150,t:'yellow',u:'100g',alt:['đậu phụ chiên']},
  {n:'Đậu hũ non hấp (100g)',c:55,t:'green',u:'100g'},
  {n:'Đậu hũ sốt cà (1 chén)',c:180,t:'yellow',u:'chén'},
  {n:'Đậu hũ nhồi thịt (1 miếng)',c:120,t:'yellow',u:'miếng'},

  // ===== RAU CỦ =====
  {n:'Bông cải xanh luộc (100g)',c:34,t:'green',u:'100g',alt:['súp lơ xanh']},
  {n:'Bông cải trắng luộc (100g)',c:25,t:'green',u:'100g',alt:['súp lơ trắng']},
  {n:'Cải bó xôi (100g)',c:23,t:'green',u:'100g',alt:['rau chân vịt','spinach']},
  {n:'Cà chua (100g)',c:18,t:'green',u:'100g',alt:['tomato']},
  {n:'Dưa leo (100g)',c:15,t:'green',u:'100g',alt:['dưa chuột']},
  {n:'Cà rốt (100g)',c:41,t:'green',u:'100g'},
  {n:'Củ cải trắng (100g)',c:18,t:'green',u:'100g',alt:['củ cải']},
  {n:'Củ dền (100g)',c:43,t:'green',u:'100g'},
  {n:'Khoai lang luộc (100g)',c:86,t:'green',u:'100g',alt:['khoai lang']},
  {n:'Khoai lang nướng (100g)',c:100,t:'green',u:'100g'},
  {n:'Khoai lang chiên (100g)',c:250,t:'red',u:'100g'},
  {n:'Khoai tây luộc (100g)',c:87,t:'green',u:'100g'},
  {n:'Khoai tây chiên (100g)',c:312,t:'red',u:'100g',alt:['khoai tây chiên']},
  {n:'Khoai tây nghiền (100g)',c:110,t:'yellow',u:'100g',alt:['mash']},
  {n:'Bí đỏ hấp (100g)',c:26,t:'green',u:'100g',alt:['bí đỏ']},
  {n:'Bí đao hấp (100g)',c:12,t:'green',u:'100g',alt:['bí đao']},
  {n:'Bầu hấp (100g)',c:14,t:'green',u:'100g',alt:['bầu']},
  {n:'Mướp hấp (100g)',c:16,t:'green',u:'100g',alt:['mướp']},
  {n:'Đậu Hà Lan (100g)',c:81,t:'green',u:'100g',alt:['đậu hà lan']},
  {n:'Nấm (100g)',c:22,t:'green',u:'100g',alt:['nấm rơm','nấm đùi gà']},
  {n:'Rong biển (100g)',c:35,t:'green',u:'100g'},
  {n:'Kim chi (100g)',c:30,t:'green',u:'100g',alt:['kimchi']},
  {n:'Dưa muối (100g)',c:20,t:'green',u:'100g',alt:['dưa chua']},
  {n:'Ngô luộc (1 bắp)',c:180,t:'green',u:'bắp',alt:['bắp','ngô']},
  {n:'Bắp rang bơ (100g)',c:500,t:'red',u:'100g',alt:['bắp rang']},

  // ===== TRÁI CÂY =====
  {n:'Táo (1 quả)',c:80,t:'green',u:'quả',alt:['apple','táo đỏ','táo xanh']},
  {n:'Ổi (1 quả)',c:45,t:'green',u:'quả',alt:['ổi xanh','ổi đào']},
  {n:'Chuối (1 quả)',c:105,t:'green',u:'quả',alt:['chuối già','chuối tiêu']},
  {n:'Chuối mini (1 quả)',c:60,t:'green',u:'quả',alt:['chuối sứ']},
  {n:'Cam (1 quả)',c:62,t:'green',u:'quả',alt:['orange','cam sành']},
  {n:'Quýt (1 quả)',c:40,t:'green',u:'quả',alt:['quýt đường']},
  {n:'Bưởi (1 múi)',c:40,t:'green',u:'múi',alt:['bưởi da xanh','bưởi năm roi']},
  {n:'Chanh dây (1 quả)',c:20,t:'green',u:'quả',alt:['chanh leo']},
  {n:'Dưa hấu (100g)',c:30,t:'green',u:'100g',alt:['dưa hấu đỏ']},
  {n:'Dưa lưới (100g)',c:36,t:'green',u:'100g',alt:['dưa vàng']},
  {n:'Đu đủ (100g)',c:43,t:'green',u:'100g',alt:['đu đủ chín']},
  {n:'Xoài chín (100g)',c:60,t:'yellow',u:'100g',alt:['xoài cát','xoài cát Hòa Lộc']},
  {n:'Xoài xanh (100g)',c:35,t:'green',u:'100g',alt:['xoài keo']},
  {n:'Nhãn (100g)',c:60,t:'yellow',u:'100g',alt:['nhãn lồng','nhãn xuồng']},
  {n:'Vải (100g)',c:66,t:'yellow',u:'100g',alt:['vải thiều']},
  {n:'Chôm chôm (100g)',c:60,t:'yellow',u:'100g',alt:['rambutan']},
  {n:'Măng cầu (100g)',c:94,t:'yellow',u:'100g',alt:['mãng cầu','na']},
  {n:'Mãng cầu xiêm (100g)',c:66,t:'yellow',u:'100g'},
  {n:'Nho (100g)',c:69,t:'yellow',u:'100g',alt:['nho xanh','nho đỏ']},
  {n:'Thanh long (100g)',c:60,t:'green',u:'100g',alt:['thanh long ruột đỏ','thanh long ruột trắng']},
  {n:'Kiwi (1 quả)',c:42,t:'green',u:'quả'},
  {n:'Dâu tây (100g)',c:32,t:'green',u:'100g',alt:['strawberry']},
  {n:'Việt quất (100g)',c:57,t:'green',u:'100g',alt:['blueberry']},
  {n:'Mâm xôi (100g)',c:52,t:'green',u:'100g',alt:['raspberry']},
  {n:'Mít (100g)',c:95,t:'yellow',u:'100g',alt:['mít Thái','mít nghệ']},
  {n:'Sầu riêng (100g)',c:147,t:'red',u:'100g',alt:['sầu riêng Ri6','sầu riêng Monthong']},
  {n:'Bơ (1/2 quả)',c:130,t:'green',u:'1/2 quả',alt:['bơ sáp','bơ booth']},
  {n:'Hồng (1 quả)',c:70,t:'green',u:'quả',alt:['hồng giòn','hồng ngâm']},
  {n:'Lê (1 quả)',c:100,t:'green',u:'quả'},
  {n:'Đào (1 quả)',c:60,t:'green',u:'quả'},
  {n:'Mận (100g)',c:46,t:'green',u:'100g',alt:['mận hậu','mận tam hoa']},
  {n:'Vú sữa (1 quả)',c:80,t:'green',u:'quả',alt:['vú sữa Lò Rèn']},
  {n:'Sapoche (1 quả)',c:80,t:'green',u:'quả',alt:['hồng xiêm','sapota']},
  {n:'Me (100g)',c:50,t:'green',u:'100g',alt:['me chín']},
  {n:'Cóc (100g)',c:40,t:'green',u:'100g'},
  {n:'Có lắc (1 gói)',c:150,t:'red',u:'gói'},
  {n:'Xoài lắc (1 gói)',c:180,t:'red',u:'gói'},
  {n:'Thơm (100g)',c:30,t:'green',u:'100g',alt:['khóm','dứa','pineapple','trái thơm']},

  // ===== SỮA =====
  {n:'Sữa chua không đường (1 hộp)',c:60,t:'green',u:'hộp',alt:['yogurt']},
  {n:'Sữa chua có đường (1 hộp)',c:100,t:'yellow',u:'hộp'},
  {n:'Sữa chua Hy Lạp (100g)',c:120,t:'green',u:'100g',alt:['greek yogurt']},
  {n:'Sữa chua uống Vinamilk (1 chai)',c:130,t:'yellow',u:'chai'},
  {n:'Promess tách béo (200ml)',c:70,t:'green',u:'ly'},
  {n:'Sữa tươi không đường (200ml)',c:100,t:'green',u:'ly'},
  {n:'Sữa tươi có đường (200ml)',c:150,t:'yellow',u:'ly'},
  {n:'Sữa hạt không đường (200ml)',c:80,t:'green',u:'ly',alt:['sữa hạt']},
  {n:'Sữa đậu nành không đường (200ml)',c:60,t:'green',u:'ly',alt:['sữa đậu']},
  {n:'Sữa đậu nành có đường (200ml)',c:120,t:'yellow',u:'ly'},
  {n:'Sữa đặc (1 thìa)',c:60,t:'red',u:'thìa',alt:['sữa ông thọ']},
  {n:'Sữa bột pha (1 ly)',c:130,t:'yellow',u:'ly'},
  {n:'Phô mai con bò cười (1 miếng)',c:60,t:'yellow',u:'miếng',alt:['phô mai']},
  {n:'Phô mai lát (1 lát)',c:80,t:'yellow',u:'lát',alt:['cheese']},
  {n:'Phô mai que (1 cây)',c:80,t:'yellow',u:'cây'},

  // ===== HẠT =====
  {n:'Hạnh nhân (10 hạt)',c:70,t:'green',u:'10 hạt',alt:['almond']},
  {n:'Hạt điều (10 hạt)',c:90,t:'green',u:'10 hạt',alt:['cashew']},
  {n:'Hạt óc chó (5 hạt)',c:65,t:'green',u:'5 hạt',alt:['walnut']},
  {n:'Hạt dẻ (10 hạt)',c:80,t:'green',u:'10 hạt',alt:['chestnut']},
  {n:'Hạt mắc ca (10 hạt)',c:100,t:'green',u:'10 hạt',alt:['macadamia']},
  {n:'Hạt dưa (30g)',c:150,t:'green',u:'30g'},
  {n:'Hạt bí (30g)',c:170,t:'green',u:'30g',alt:['hạt bí ngô']},
  {n:'Hạt hướng dương (30g)',c:180,t:'green',u:'30g'},
  {n:'Đậu phộng rang (30g)',c:170,t:'green',u:'30g',alt:['đậu phộng']},
  {n:'Bơ đậu phộng (1 thìa)',c:95,t:'green',u:'thìa',alt:['peanut butter']},
  {n:'Mứt (1 thìa)',c:50,t:'red',u:'thìa',alt:['jam']},

  // ===== ĐỒ ĂN VẶT =====
  {n:'Bánh quy (2 cái)',c:80,t:'red',u:'2 cái',alt:['cookie']},
  {n:'Snack khoai tây (1 gói)',c:300,t:'red',u:'gói',alt:['snack']},
  {n:'Snack tôm (1 gói)',c:200,t:'red',u:'gói'},
  {n:'Chè đậu xanh (1 chén)',c:250,t:'red',u:'chén',alt:['chè đậu']},
  {n:'Chè ba màu (1 ly)',c:300,t:'red',u:'ly'},
  {n:'Chè thái (1 ly)',c:350,t:'red',u:'ly',alt:['chè Thái']},
  {n:'Chè hạt sen (1 chén)',c:220,t:'yellow',u:'chén'},
  {n:'Chè bưởi (1 ly)',c:280,t:'red',u:'ly'},
  {n:'Chè khúc bạch (1 ly)',c:250,t:'red',u:'ly'},
  {n:'Kem (1 ly)',c:200,t:'red',u:'ly',alt:['ice cream']},
  {n:'Kem ốc quế',c:200,t:'red',u:'cây',alt:['kem cone']},
  {n:'Kem Merino (1 cây)',c:180,t:'red',u:'cây'},
  {n:'Socola (1 thanh nhỏ)',c:250,t:'red',u:'thanh',alt:['chocolate']},
  {n:'Kẹo (1 viên)',c:25,t:'red',u:'viên'},

  // ===== ĐỒ UỐNG =====
  {n:'Cà phê đen không đường',c:5,t:'green',u:'ly',alt:['cà phê đen']},
  {n:'Cà phê sữa đá',c:150,t:'red',u:'ly'},
  {n:'Cà phê sữa nóng',c:180,t:'red',u:'ly'},
  {n:'Bạc xỉu',c:180,t:'red',u:'ly'},
  {n:'Cà phê muối',c:150,t:'red',u:'ly'},
  {n:'Trà đen không đường',c:0,t:'green',u:'ly',alt:['trà đá']},
  {n:'Trà xanh không đường',c:0,t:'green',u:'ly'},
  {n:'Trà đào cam sả (ít đường)',c:80,t:'yellow',u:'ly',alt:['trà đào']},
  {n:'Trà đào cam sả (đường)',c:150,t:'red',u:'ly'},
  {n:'Trà sữa (1 ly)',c:400,t:'red',u:'ly',alt:['trà sữa truyền thống']},
  {n:'Trà sữa trân châu (1 ly)',c:500,t:'red',u:'ly',alt:['trà sữa trân châu đường đen']},
  {n:'Trà sữa matcha (1 ly)',c:400,t:'red',u:'ly'},
  {n:'Trà sữa Thái (1 ly)',c:350,t:'red',u:'ly'},
  {n:'Nước ngọt có ga (1 lon)',c:140,t:'red',u:'lon',alt:['coca','pepsi','7up']},
  {n:'Nước ngọt ăn kiêng (1 lon)',c:0,t:'green',u:'lon',alt:['coca zero','pepsi zero']},
  {n:'Nước cam (1 ly 200ml)',c:100,t:'yellow',u:'ly'},
  {n:'Nước ép táo (200ml)',c:95,t:'yellow',u:'ly'},
  {n:'Nước ép cà rốt (200ml)',c:80,t:'green',u:'ly'},
  {n:'Nước ép cần tây (200ml)',c:40,t:'green',u:'ly'},
  {n:'Sinh tố bơ (1 ly)',c:300,t:'yellow',u:'ly'},
  {n:'Sinh tố xoài (1 ly)',c:250,t:'yellow',u:'ly'},
  {n:'Sinh tố mãng cầu (1 ly)',c:280,t:'yellow',u:'ly'},
  {n:'Nước dừa tươi (1 ly)',c:50,t:'green',u:'ly',alt:['nước dừa']},
  {n:'Nước mía (1 ly)',c:150,t:'yellow',u:'ly'},
  {n:'Nước chanh (1 ly)',c:20,t:'green',u:'ly',alt:['nước chanh muối']},
  {n:'Bia (1 lon 330ml)',c:150,t:'red',u:'lon',alt:['beer']},
  {n:'Bia lon nhỏ (1 lon 250ml)',c:110,t:'red',u:'lon'},
  {n:'Rượu vang đỏ (1 ly)',c:120,t:'red',u:'ly'},
  {n:'Rượu mạnh (1 shot)',c:100,t:'red',u:'shot'},

  // ===== CHUỖI CÀ PHÊ =====
  {n:'Highlands Cà phê sữa đá',c:180,t:'red',u:'ly',alt:['highlands']},
  {n:'Highlands Cà phê đen đá',c:10,t:'green',u:'ly'},
  {n:'Highlands Trà sen vàng',c:250,t:'red',u:'ly'},
  {n:'Highlands Freeze trà xanh',c:400,t:'red',u:'ly'},
  {n:'Highlands Bánh mì chảo',c:500,t:'red',u:'phần'},
  {n:'Phúc Long Trà đào',c:150,t:'yellow',u:'ly',alt:['phúc long']},
  {n:'Phúc Long Trà sữa (1 ly)',c:350,t:'red',u:'ly'},
  {n:'Phúc Long Bánh mì chảo',c:480,t:'red',u:'phần'},
  {n:'Katinat Trà sữa (1 ly)',c:350,t:'red',u:'ly',alt:['katinat']},
  {n:'Katinat Cà phê sữa (1 ly)',c:200,t:'red',u:'ly'},
  {n:'Mixue Kem ốc quế',c:200,t:'red',u:'cây',alt:['mixue']},
  {n:'Mixue Trà sữa trân châu',c:350,t:'red',u:'ly'},
  {n:'Gongcha Trà sữa trân châu',c:400,t:'red',u:'ly',alt:['gongcha']},
  {n:'Koi Trà sữa trân châu',c:400,t:'red',u:'ly',alt:['koi']},
  {n:'Tocotoco Trà sữa trân châu',c:380,t:'red',u:'ly',alt:['tocotoco']},
  {n:'Starbucks Latte (tall)',c:190,t:'yellow',u:'ly',alt:['starbucks']},
  {n:'Starbucks Frappuccino (tall)',c:400,t:'red',u:'ly'},
  {n:'Starbucks Americano',c:15,t:'green',u:'ly'},

  // ===== FAST FOOD =====
  {n:'Jollibee Gà giòn (1 miếng)',c:400,t:'red',u:'miếng',alt:['jollibee']},
  {n:'Jollibee Gà sốt cay (1 miếng)',c:420,t:'red',u:'miếng'},
  {n:'Jollibee Burger tôm (1 cái)',c:400,t:'red',u:'cái'},
  {n:'Jollibee Burger gà (1 cái)',c:450,t:'red',u:'cái'},
  {n:'Jollibee Spaghetti (1 hộp)',c:400,t:'red',u:'hộp'},
  {n:'Jollibee Khoai tây chiên (1 gói)',c:280,t:'red',u:'gói'},
  {n:'KFC Gà rán (1 miếng)',c:300,t:'red',u:'miếng',alt:['kfc']},
  {n:'KFC Burger Zinger (1 cái)',c:500,t:'red',u:'cái'},
  {n:'KFC Khoai tây chiên (1 gói)',c:250,t:'red',u:'gói'},
  {n:'KFC Popcorn chicken (1 gói)',c:300,t:'red',u:'gói'},
  {n:'Lotteria Burger tôm (1 cái)',c:350,t:'red',u:'cái',alt:['lotteria']},
  {n:'Lotteria Gà rán (1 miếng)',c:280,t:'red',u:'miếng'},
  {n:'Pizza Hut Pizza (1 miếng)',c:280,t:'red',u:'miếng',alt:['pizza hut']},
  {n:'Pizza Hut Mì Ý (1 dĩa)',c:500,t:'red',u:'dĩa'},
  {n:'Domino Pizza (1 miếng)',c:290,t:'red',u:'miếng',alt:['domino']},
  {n:'Gà rán Texas (1 miếng)',c:320,t:'red',u:'miếng',alt:['texas']},
  {n:'Gà rán Popeyes (1 miếng)',c:320,t:'red',u:'miếng',alt:['popeyes']},
  {n:'Gà rán 4F (1 miếng)',c:300,t:'red',u:'miếng',alt:['4f']},
  {n:"McDonald's Big Mac (1 cái)",c:550,t:'red',u:'cái',alt:['mcdonald']},
  {n:"McDonald's McChicken (1 cái)",c:400,t:'red',u:'cái'},
  {n:"McDonald's Khoai tây chiên (1 gói)",c:250,t:'red',u:'gói'},

  // ===== MÓN Á =====
  {n:'Sushi cuộn (8 miếng)',c:400,t:'yellow',u:'8 miếng',alt:['sushi']},
  {n:'Sashimi cá hồi (6 miếng)',c:180,t:'green',u:'6 miếng',alt:['sashimi']},
  {n:'Takoyaki (6 viên)',c:350,t:'yellow',u:'6 viên'},
  {n:'Bibimbap Hàn (1 tô)',c:500,t:'yellow',u:'tô',alt:['bibimbap']},
  {n:'Tokbokki (1 phần)',c:400,t:'red',u:'phần',alt:['tokbokki','tteokbokki']},
  {n:'Há cảo (4 cái)',c:200,t:'yellow',u:'4 cái',alt:['dimsum','há cảo']},
  {n:'Xíu mại (4 viên)',c:180,t:'yellow',u:'4 viên'},
  {n:'Bánh bao (1 cái)',c:250,t:'yellow',u:'cái'},
  {n:'Vịt quay Bắc Kinh (100g)',c:280,t:'yellow',u:'100g',alt:['vịt quay']},
  {n:'Pad Thái (1 dĩa)',c:500,t:'yellow',u:'dĩa',alt:['pad thai']},
  {n:'Tom Yum (1 tô)',c:150,t:'green',u:'tô',alt:['tom yum']},
  {n:'Xôi xoài Thái (1 phần)',c:400,t:'red',u:'phần'},

  // ===== MÓN CHAY =====
  {n:'Cơm chay (1 dĩa)',c:350,t:'green',u:'dĩa'},
  {n:'Bún chay (1 tô)',c:300,t:'green',u:'tô'},
  {n:'Phở chay (1 tô)',c:280,t:'green',u:'tô'},
  {n:'Gỏi cuốn chay (1 cuốn)',c:60,t:'green',u:'cuốn'},
  {n:'Chả chay (100g)',c:180,t:'green',u:'100g'},
  {n:'Nem chay (1 cuốn)',c:100,t:'green',u:'cuốn'},

  // ===== HEALTHY =====
  {n:'Salad trộn dầu giấm (1 dĩa)',c:100,t:'green',u:'dĩa'},
  {n:'Salad ức gà (1 dĩa)',c:250,t:'green',u:'dĩa'},
  {n:'Granola (40g)',c:180,t:'green',u:'40g'},
  {n:'Yến mạch (40g)',c:150,t:'green',u:'40g',alt:['oatmeal']},
  {n:'Chia seed (1 thìa)',c:60,t:'green',u:'thìa'},
  {n:'Hạt lanh (1 thìa)',c:55,t:'green',u:'thìa'}
];

// ========== COMPOSITE FOODS ==========
const COMPOSITE_FOODS=[
  {
    n:'Bún bò Huế',t:'yellow',icon:'🍜',
    components:[
      {id:'bun',name:'Bún tươi',cal:165,note:'1 chén',default:1},
      {id:'nuoc',name:'Nước dùng',cal:80,note:'Húp hết',default:0.5},
      {id:'bo_tai',name:'Thịt bò tái',cal:100,note:'1 phần ~50g',default:1},
      {id:'nam',name:'Nạm bò',cal:120,note:'1 phần ~50g',default:0},
      {id:'gio',name:'Giò heo',cal:120,note:'1 khoanh',default:0},
      {id:'cha_bo',name:'Chả bò',cal:60,note:'3 lát',default:1},
      {id:'cha_cua',name:'Chả cua',cal:40,note:'1 viên',default:0},
      {id:'trung_cut',name:'Trứng cút',cal:30,note:'2 quả',default:0},
      {id:'rau',name:'Rau sống + giá trụng',cal:15,note:'1 nắm',default:1},
      {id:'sate',name:'Sa tế + dầu ớt',cal:30,note:'1 thìa',default:1}
    ],
    presets:{
      'Tô đầy đủ':{bun:1,nuoc:1,bo_tai:1,nam:1,gio:1,cha_bo:1,cha_cua:1,trung_cut:1,rau:1,sate:1},
      'Tô cơ bản':{bun:1,nuoc:1,bo_tai:1,cha_bo:1,rau:1},
      'Tô ít bún':{bun:0.5,nuoc:0.5,bo_tai:1,cha_bo:1,rau:1.5,sate:1},
      'Tô nước trong':{bun:1,nuoc:0.3,bo_tai:1,cha_bo:1,rau:1,sate:0}
    }
  },
  {
    n:'Phở bò',t:'yellow',icon:'🍜',
    components:[
      {id:'banh',name:'Bánh phở',cal:200,note:'1 chén',default:1},
      {id:'nuoc',name:'Nước dùng',cal:80,note:'Húp hết',default:0.7},
      {id:'tai',name:'Thịt bò tái',cal:90,note:'1 phần ~50g',default:1},
      {id:'nam',name:'Nạm bò',cal:120,note:'1 phần ~50g',default:0},
      {id:'gau',name:'Gầu bò',cal:150,note:'1 phần ~50g',default:0},
      {id:'gan',name:'Gân bò',cal:80,note:'1 phần ~50g',default:0},
      {id:'bo_vien',name:'Bò viên',cal:80,note:'3 viên',default:0},
      {id:'hanh',name:'Hành lá + ngò',cal:10,note:'1 nắm',default:1},
      {id:'gia',name:'Giá đỗ',cal:15,note:'1 nắm',default:1}
    ],
    presets:{
      'Tô tái':{banh:1,nuoc:0.7,tai:1,hanh:1,gia:1},
      'Tô tái nạm':{banh:1,nuoc:0.7,tai:1,nam:1,hanh:1,gia:1},
      'Tô đầy đủ':{banh:1,nuoc:1,tai:1,nam:1,gau:1,gan:1,bo_vien:1,hanh:1,gia:1},
      'Tô ít bánh':{banh:0.5,nuoc:0.7,tai:1,hanh:1,gia:1}
    }
  },
  {
    n:'Cơm tấm',t:'yellow',icon:'🍚',
    components:[
      {id:'com',name:'Cơm tấm',cal:230,note:'1 chén',default:1},
      {id:'suon_nho',name:'Sườn nướng nhỏ',cal:130,note:'~50g',default:1},
      {id:'suon_to',name:'Sườn nướng to',cal:260,note:'~100g',default:0},
      {id:'trung_op',name:'Trứng ốp la',cal:120,note:'1 quả',default:0},
      {id:'trung_kho',name:'Trứng kho',cal:120,note:'1 quả',default:0},
      {id:'lap_xuong',name:'Lạp xưởng',cal:200,note:'1 cây',default:0},
      {id:'bi',name:'Bì',cal:80,note:'1 phần',default:0},
      {id:'cha',name:'Chả',cal:100,note:'1 miếng',default:0},
      {id:'mo_hanh',name:'Mỡ hành',cal:50,note:'1 thìa',default:1},
      {id:'top_mo',name:'Tóp mỡ',cal:60,note:'1 thìa',default:0},
      {id:'do_chua',name:'Đồ chua',cal:15,note:'1 phần',default:1}
    ],
    presets:{
      'Cơm sườn':{com:1,suon_nho:1,mo_hanh:1,do_chua:1},
      'Cơm sườn bì chả':{com:1,suon_nho:1,bi:1,cha:1,mo_hanh:1,do_chua:1},
      'Cơm sườn trứng':{com:1,suon_nho:1,trung_op:1,mo_hanh:1,do_chua:1},
      'Cơm tấm đầy đủ':{com:1,suon_to:1,trung_op:1,lap_xuong:1,bi:1,mo_hanh:1,do_chua:1}
    }
  },
  {
    n:'Hủ tiếu Nam Vang',t:'yellow',icon:'🍜',
    components:[
      {id:'hu_tieu',name:'Hủ tiếu',cal:200,note:'1 chén',default:1},
      {id:'nuoc',name:'Nước dùng',cal:80,note:'Húp hết',default:0.7},
      {id:'thit',name:'Thịt heo bằm',cal:80,note:'1 phần',default:1},
      {id:'tom',name:'Tôm',cal:60,note:'3 con',default:1},
      {id:'trung_cut',name:'Trứng cút',cal:45,note:'3 quả',default:1},
      {id:'gan',name:'Gan heo',cal:60,note:'1 miếng',default:0},
      {id:'xuong',name:'Xương',cal:30,note:'1 cục',default:0},
      {id:'hanh',name:'Hành + hẹ',cal:10,note:'1 nắm',default:1},
      {id:'gia',name:'Giá đỗ',cal:15,note:'1 nắm',default:1},
      {id:'toi_phi',name:'Tỏi phi',cal:30,note:'1 thìa',default:0}
    ],
    presets:{
      'Tô cơ bản':{hu_tieu:1,nuoc:0.7,thit:1,tom:1,trung_cut:1,hanh:1,gia:1},
      'Tô đầy đủ':{hu_tieu:1,nuoc:1,thit:1,tom:1,trung_cut:1,gan:1,xuong:1,hanh:1,gia:1,toi_phi:1},
      'Tô ít bún':{hu_tieu:0.5,nuoc:0.7,thit:1,tom:1,trung_cut:1,hanh:1,gia:1},
      'Tô thập cẩm':{hu_tieu:1,nuoc:1,thit:1.5,tom:1.5,trung_cut:1.5,gan:1,xuong:1,hanh:1,gia:1,toi_phi:1}
    }
  },
  {
    n:'Cơm gà Hải Nam',t:'yellow',icon:'🍚',
    components:[
      {id:'com',name:'Cơm gà',cal:280,note:'1 chén',default:1},
      {id:'ga',name:'Gà luộc/xé',cal:180,note:'1 phần ~100g',default:1},
      {id:'da_ga',name:'Da gà',cal:80,note:'1 miếng',default:0},
      {id:'canh',name:'Canh gà',cal:50,note:'1 chén',default:1},
      {id:'dua',name:'Dưa leo + cà chua',cal:20,note:'1 phần',default:1},
      {id:'nuoc_cham',name:'Nước chấm gừng',cal:30,note:'1 chén',default:1}
    ],
    presets:{
      'Cơm gà cơ bản':{com:1,ga:1,canh:1,dua:1,nuoc_cham:1},
      'Cơm gà đầy đủ':{com:1,ga:1,da_ga:1,canh:1,dua:1,nuoc_cham:1},
      'Cơm gà không da':{com:1,ga:1,canh:1,dua:1,nuoc_cham:1}
    }
  },
  {
    n:'Cơm chiên dương châu',t:'yellow',icon:'🍚',
    components:[
      {id:'com',name:'Cơm chiên',cal:280,note:'1 chén',default:1},
      {id:'trung',name:'Trứng',cal:60,note:'1 quả',default:1},
      {id:'tom',name:'Tôm',cal:50,note:'3 con',default:1},
      {id:'lap_xuong',name:'Lạp xưởng',cal:100,note:'1 phần',default:1},
      {id:'dau_ha_lan',name:'Đậu Hà Lan',cal:20,note:'1 phần',default:1},
      {id:'ca_rot',name:'Cà rốt',cal:15,note:'1 phần',default:1},
      {id:'hanh',name:'Hành lá',cal:10,note:'1 nắm',default:1}
    ],
    presets:{
      'Cơ bản':{com:1,trung:1,tom:1,dau_ha_lan:1,ca_rot:1,hanh:1},
      'Đầy đủ':{com:1,trung:1,tom:1,lap_xuong:1,dau_ha_lan:1,ca_rot:1,hanh:1}
    }
  },
  {
    n:'Bánh mì thịt',t:'yellow',icon:'🥖',
    components:[
      {id:'banh',name:'Bánh mì',cal:200,note:'1 ổ',default:1},
      {id:'thit',name:'Thịt heo',cal:80,note:'3-4 lát',default:1},
      {id:'cha',name:'Chả lụa',cal:60,note:'2 lát',default:1},
      {id:'pate',name:'Pate',cal:60,note:'1 thìa',default:1},
      {id:'trung',name:'Trứng ốp',cal:120,note:'1 quả',default:0},
      {id:'do_chua',name:'Đồ chua',cal:15,note:'1 nắm',default:1},
      {id:'dua',name:'Dưa leo',cal:10,note:'vài lát',default:1},
      {id:'rau',name:'Rau ngò',cal:5,note:'1 nắm',default:1},
      {id:'tuong_ot',name:'Tương ớt',cal:15,note:'1 thìa',default:1}
    ],
    presets:{
      'Bánh mì thịt':{banh:1,thit:1,cha:1,pate:1,do_chua:1,dua:1,rau:1,tuong_ot:1},
      'Bánh mì trứng':{banh:1,trung:1,pate:1,do_chua:1,dua:1,rau:1,tuong_ot:1},
      'Bánh mì đặc biệt':{banh:1,thit:1,cha:1,pate:1,trung:1,do_chua:1,dua:1,rau:1,tuong_ot:1}
    }
  },
  {
    n:'Bún chả',t:'yellow',icon:'🍜',
    components:[
      {id:'bun',name:'Bún',cal:180,note:'1 chén',default:1},
      {id:'cha_mieng',name:'Chả miếng',cal:120,note:'3 miếng',default:1},
      {id:'cha_vien',name:'Chả viên',cal:80,note:'5 viên',default:0},
      {id:'nuoc_cham',name:'Nước mắm chấm',cal:50,note:'1 chén',default:1},
      {id:'rau',name:'Rau sống',cal:15,note:'1 nắm',default:1},
      {id:'dua_gop',name:'Dưa góp',cal:20,note:'1 phần',default:1}
    ],
    presets:{
      'Bún chả cơ bản':{bun:1,cha_mieng:1,nuoc_cham:1,rau:1,dua_gop:1},
      'Bún chả đầy đủ':{bun:1,cha_mieng:1,cha_vien:1,nuoc_cham:1,rau:1,dua_gop:1}
    }
  },
  {
    n:'Bún đậu mắm tôm',t:'red',icon:'🍜',
    components:[
      {id:'bun',name:'Bún lá',cal:180,note:'1 chén',default:1},
      {id:'dau',name:'Đậu hũ chiên',cal:150,note:'3 miếng',default:1},
      {id:'cha_com',name:'Chả cốm',cal:120,note:'3 miếng',default:1},
      {id:'thit_cho',name:'Thịt chó',cal:200,note:'1 phần',default:0},
      {id:'heo_quay',name:'Heo quay',cal:200,note:'1 phần',default:0},
      {id:'mam_tom',name:'Mắm tôm',cal:30,note:'1 chén',default:1},
      {id:'rau',name:'Rau sống',cal:15,note:'1 nắm',default:1}
    ],
    presets:{
      'Bún đậu cơ bản':{bun:1,dau:1,mam_tom:1,rau:1},
      'Bún đậu đầy đủ':{bun:1,dau:1,cha_com:1,heo_quay:1,mam_tom:1,rau:1}
    }
  },
  {
    n:'Bánh xèo',t:'yellow',icon:'🥞',
    components:[
      {id:'vo',name:'Vỏ bánh',cal:200,note:'1 cái',default:1},
      {id:'tom',name:'Tôm',cal:50,note:'3 con',default:1},
      {id:'thit',name:'Thịt ba chỉ',cal:100,note:'1 phần',default:1},
      {id:'gia',name:'Giá đỗ',cal:15,note:'1 nắm',default:1},
      {id:'rau',name:'Rau sống',cal:20,note:'1 nắm',default:1},
      {id:'nuoc_cham',name:'Nước chấm',cal:40,note:'1 chén',default:1}
    ],
    presets:{
      'Bánh xèo đầy đủ':{vo:1,tom:1,thit:1,gia:1,rau:1,nuoc_cham:1},
      'Bánh xèo chay':{vo:1,gia:1,rau:1,nuoc_cham:1}
    }
  },
  {
    n:'Gỏi cuốn',t:'green',icon:'🌯',
    components:[
      {id:'banh_trang',name:'Bánh tráng',cal:30,note:'1 cuốn',default:1},
      {id:'tom',name:'Tôm',cal:20,note:'2 con',default:1},
      {id:'thit',name:'Thịt heo',cal:30,note:'1 lát',default:1},
      {id:'bun',name:'Bún',cal:20,note:'1 nhúm',default:1},
      {id:'rau',name:'Rau sống',cal:10,note:'1 nắm',default:1},
      {id:'nuoc_cham',name:'Nước chấm',cal:40,note:'1 chén',default:1}
    ],
    presets:{
      'Gỏi cuốn tôm thịt':{banh_trang:1,tom:1,thit:1,bun:1,rau:1,nuoc_cham:1},
      'Gỏi cuốn chay':{banh_trang:1,bun:1,rau:1,nuoc_cham:1}
    }
  },
  {
    n:'Bún thịt nướng',t:'yellow',icon:'🍜',
    components:[
      {id:'bun',name:'Bún',cal:180,note:'1 chén',default:1},
      {id:'thit',name:'Thịt nướng',cal:150,note:'1 phần',default:1},
      {id:'cha_gio',name:'Chả giò',cal:120,note:'1 cuốn',default:1},
      {id:'rau',name:'Rau sống + giá',cal:20,note:'1 nắm',default:1},
      {id:'dau_phong',name:'Đậu phộng rang',cal:50,note:'1 thìa',default:1},
      {id:'nuoc_cham',name:'Nước mắm',cal:50,note:'1 chén',default:1}
    ],
    presets:{
      'Bún thịt nướng':{bun:1,thit:1,cha_gio:1,rau:1,dau_phong:1,nuoc_cham:1},
      'Bún thịt không chả giò':{bun:1,thit:1,rau:1,dau_phong:1,nuoc_cham:1}
    }
  },
  {
    n:'Xôi mặn',t:'yellow',icon:'🍙',
    components:[
      {id:'xoi',name:'Xôi',cal:300,note:'1 chén',default:1},
      {id:'cha',name:'Chả lụa',cal:60,note:'2 lát',default:1},
      {id:'thit',name:'Thịt kho',cal:120,note:'1 phần',default:1},
      {id:'trung',name:'Trứng cút',cal:45,note:'3 quả',default:1},
      {id:'lap_xuong',name:'Lạp xưởng',cal:100,note:'1 cây',default:1},
      {id:'mo_hanh',name:'Mỡ hành',cal:40,note:'1 thìa',default:1},
      {id:'ruoc',name:'Ruốc/chà bông',cal:50,note:'1 thìa',default:1}
    ],
    presets:{
      'Xôi cơ bản':{xoi:1,cha:1,mo_hanh:1},
      'Xôi đầy đủ':{xoi:1,cha:1,thit:1,trung:1,lap_xuong:1,mo_hanh:1,ruoc:1}
    }
  },
  {
    n:'Bánh mì chảo',t:'red',icon:'🍳',
    components:[
      {id:'banh',name:'Bánh mì',cal:150,note:'1 ổ',default:1},
      {id:'trung',name:'Trứng ốp',cal:120,note:'2 quả',default:1},
      {id:'pate',name:'Pate',cal:80,note:'1 phần',default:1},
      {id:'xa_xiu',name:'Xá xíu',cal:100,note:'1 phần',default:1},
      {id:'cha',name:'Chả lụa',cal:60,note:'2 lát',default:1},
      {id:'bo',name:'Bò né',cal:100,note:'1 phần',default:0},
      {id:'hanh',name:'Hành tây',cal:20,note:'1 phần',default:1},
      {id:'do_chua',name:'Đồ chua',cal:15,note:'1 phần',default:1}
    ],
    presets:{
      'Bánh mì chảo cơ bản':{banh:1,trung:1,pate:1,cha:1,hanh:1,do_chua:1},
      'Bánh mì chảo đầy đủ':{banh:1,trung:1,pate:1,xa_xiu:1,cha:1,bo:1,hanh:1,do_chua:1}
    }
  },
  {
    n:'Bún riêu cua',t:'yellow',icon:'🍜',
    components:[
      {id:'bun',name:'Bún',cal:180,note:'1 chén',default:1},
      {id:'nuoc',name:'Nước dùng',cal:60,note:'Húp hết',default:0.7},
      {id:'rieu',name:'Riêu cua',cal:80,note:'1 phần',default:1},
      {id:'dau_hu',name:'Đậu hũ chiên',cal:80,note:'1 miếng',default:1},
      {id:'ca_chua',name:'Cà chua',cal:20,note:'1 phần',default:1},
      {id:'rau',name:'Rau sống',cal:15,note:'1 nắm',default:1},
      {id:'mam_tom',name:'Mắm tôm',cal:20,note:'1 thìa',default:1}
    ],
    presets:{
      'Bún riêu cơ bản':{bun:1,nuoc:0.7,rieu:1,dau_hu:1,ca_chua:1,rau:1,mam_tom:1},
      'Bún riêu ốc':{bun:1,nuoc:0.7,rieu:1,dau_hu:1,ca_chua:1,rau:1,mam_tom:1}
    }
  },
  {
    n:'Lẩu Thái (1 phần)',t:'yellow',icon:'🍲',
    components:[
      {id:'nuoc',name:'Nước lẩu',cal:100,note:'1 chén',default:1},
      {id:'tom',name:'Tôm',cal:100,note:'1 phần',default:1},
      {id:'muc',name:'Mực',cal:80,note:'1 phần',default:1},
      {id:'ca',name:'Cá',cal:100,note:'1 phần',default:1},
      {id:'thit_bo',name:'Thịt bò',cal:150,note:'1 phần',default:1},
      {id:'rau',name:'Rau nhúng',cal:30,note:'1 phần',default:1},
      {id:'nam',name:'Nấm',cal:30,note:'1 phần',default:1},
      {id:'mi',name:'Mì/bún',cal:150,note:'1 phần',default:1}
    ],
    presets:{
      'Phần cơ bản':{nuoc:1,tom:1,muc:1,rau:1,nam:1,mi:1},
      'Phần đầy đủ':{nuoc:1,tom:1,muc:1,ca:1,thit_bo:1,rau:1,nam:1,mi:1}
    }
  }
];

// ========== EXERCISE DATABASE (MET formula) ==========
const EXERCISE_DB=[
  {n:'Đi bộ chậm (3km/h)',met:2.5,icon:'🚶'},
  {n:'Đi bộ vừa (5km/h)',met:3.5,icon:'🚶'},
  {n:'Đi bộ nhanh (6.5km/h)',met:4.3,icon:'🚶‍♂️'},
  {n:'Chạy bộ (8km/h)',met:8.3,icon:'🏃'},
  {n:'Chạy bộ (10km/h)',met:9.8,icon:'🏃‍♂️'},
  {n:'Chạy bộ (12km/h)',met:11.5,icon:'🏃'},
  {n:'Đạp xe nhẹ (<16km/h)',met:4,icon:'🚴'},
  {n:'Đạp xe vừa (16-19km/h)',met:6,icon:'🚴'},
  {n:'Đạp xe nhanh (>19km/h)',met:8,icon:'🚴‍♂️'},
  {n:'Xe đạp tại nhà (nhẹ)',met:4,icon:'🚴'},
  {n:'Xe đạp tại nhà (vừa)',met:5.5,icon:'🚴'},
  {n:'Xe đạp tại nhà (nặng)',met:7,icon:'🚴'},
  {n:'Yoga',met:3,icon:'🧘'},
  {n:'Pilates',met:3,icon:'🧘‍♀️'},
  {n:'Gym - tạ nhẹ',met:3.5,icon:'🏋️'},
  {n:'Gym - tạ nặng',met:6,icon:'💪'},
  {n:'Gym - compound',met:7,icon:'🏋️‍♂️'},
  {n:'Bơi lội (vừa)',met:6,icon:'🏊'},
  {n:'Bơi nhanh',met:8,icon:'🏊‍♂️'},
  {n:'Aerobic',met:7.3,icon:'🤸'},
  {n:'Zumba',met:6.5,icon:'💃'},
  {n:'Dance/Khiêu vũ',met:5,icon:'🕺'},
  {n:'Boxing',met:7.8,icon:'🥊'},
  {n:'Kickfit',met:8,icon:'🥊'},
  {n:'Đá cầu',met:5.5,icon:'⚽'},
  {n:'Cầu lông',met:5.5,icon:'🏸'},
  {n:'Bóng bàn',met:4,icon:'🏓'},
  {n:'Bóng đá',met:7,icon:'⚽'},
  {n:'Bóng rổ',met:6.5,icon:'🏀'},
  {n:'Tennis',met:7.3,icon:'🎾'},
  {n:'Võ thuật',met:10,icon:'🥋'},
  {n:'BJJ/Judo',met:10,icon:'🥋'},
  {n:'Leo núi',met:8,icon:'🧗'},
  {n:'Đạp xe địa hình',met:8.5,icon:'🚵'},
  {n:'Plank',met:3,icon:'🧘'},
  {n:'Squat',met:5,icon:'🏋️'},
  {n:'Hít đất',met:5,icon:'💪'},
  {n:'Nhảy dây',met:12.3,icon:'🤸'},
  {n:'Leo cầu thang',met:8.8,icon:'🪜'},
  {n:'Dọn nhà',met:3,icon:'🧹'},
  {n:'Khác',met:5,icon:'❓'}
];

// ========== PLAN ==========
const PLAN={
  weekday:[
    {id:'m_light',type:'meal',time:'06:00',label:'Sáng nhẹ (6:00)',icon:'🌅',planned:[{name:'Sữa chua không đường (1 hộp)',cal:60,tag:'green'},{name:'Hạnh nhân (10 hạt)',cal:70,tag:'green'}]},
    {id:'m_main',type:'meal',time:'09:00',label:'Sáng chính (9:00)',icon:'🍳',planned:[{name:'Trứng luộc (1 quả)',cal:78,qty:2,tag:'green'},{name:'Promess tách béo (200ml)',cal:70,tag:'green'},{name:'Chuối (1 quả)',cal:105,tag:'green'}]},
    {id:'m_lunch',type:'meal',time:'11:30',label:'Trưa (11:30)',icon:'🍱',planned:[{name:'Cơm gạo lứt (1 chén)',cal:180,tag:'green'},{name:'Thịt nạc luộc (100g)',cal:145,tag:'green'},{name:'Rau (100g)',cal:30,tag:'green'}]},
    {id:'m_snack',type:'meal',time:'14:00',label:'Phụ chiều (14:00)',icon:'🍎',planned:[{name:'Táo (1 quả)',cal:80,tag:'green'}]},
    {id:'m_dinner',type:'meal',time:'18:30',label:'Tối (18:30)',icon:'🍲',planned:[{name:'Thịt/cá (100g)',cal:180,tag:'green'},{name:'Rau (100g)',cal:30,tag:'green'},{name:'Cơm gạo lứt (1 chén nhỏ)',cal:130,tag:'green'}]},
    {id:'m_night',type:'meal',time:'21:00',label:'Phụ đêm (nếu đói)',icon:'🌙',planned:[{name:'Sữa ấm không đường (200ml)',cal:100,tag:'green'}]},
    {id:'h_water',type:'habit',label:'Uống đủ nước (2L)',icon:'💧'},
    {id:'ex_bike',type:'exercise',label:'Xe đạp tại nhà 20-30p',icon:'🚴',defaultEx:'Xe đạp tại nhà (vừa)',defaultMin:25},
    {id:'ex_walk',type:'exercise',label:'Đi bộ nhẹ 10-15p',icon:'🚶',defaultEx:'Đi bộ vừa (5km/h)',defaultMin:15},
    {id:'h_sleep',type:'habit',label:'Ngủ trước 22:30',icon:'😴'},
    {id:'h_steps',type:'habit',label:'Nhập số bước chân',icon:'👟'},
    {id:'h_nosugar',type:'habit',label:'Không ăn đồ ngọt/trà sữa',icon:'🚫'}
  ],
  saturday:[
    {id:'m_light',type:'meal',time:'09:00',label:'Sáng muộn (9:00)',icon:'🌅',planned:[{name:'Trứng luộc (1 quả)',cal:78,qty:2,tag:'green'},{name:'Bánh mì nguyên cám (1 lát)',cal:80,tag:'green'}]},
    {id:'m_lunch',type:'meal',time:'12:30',label:'Trưa đi chơi',icon:'🍜',planned:[{name:'(ăn ngoài)',cal:450,tag:'yellow'}]},
    {id:'m_snack',type:'meal',time:'16:00',label:'Phụ chiều',icon:'🍎',planned:[{name:'Trái cây',cal:80,tag:'green'}]},
    {id:'m_dinner',type:'meal',time:'19:00',label:'Tối nhẹ',icon:'🍲',planned:[{name:'Thịt/cá (100g)',cal:180,tag:'green'},{name:'Rau (100g)',cal:30,tag:'green'}]},
    {id:'h_water',type:'habit',label:'Uống đủ nước',icon:'💧'},
    {id:'ex_walk',type:'exercise',label:'Vận động nhẹ',icon:'🚶',defaultEx:'Đi bộ vừa (5km/h)',defaultMin:20},
    {id:'h_sleep',type:'habit',label:'Ngủ trước 23:30',icon:'😴'},
    {id:'h_steps',type:'habit',label:'Nhập steps',icon:'👟'},
    {id:'h_nosugar',type:'habit',label:'Hạn chế đồ ngọt',icon:'🚫'},
    {id:'h_cheat',type:'habit',label:'Cheat meal có kiểm soát',icon:'🎁'}
  ],
  sunday:[
    {id:'m_light',type:'meal',time:'09:00',label:'Sáng muộn',icon:'🌅',planned:[{name:'Trứng luộc (1 quả)',cal:78,qty:2,tag:'green'},{name:'Promess tách béo (200ml)',cal:70,tag:'green'}]},
    {id:'m_lunch',type:'meal',time:'12:00',label:'Trưa nhẹ',icon:'🍱',planned:[{name:'Cơm gạo lứt (1 chén)',cal:180,tag:'green'},{name:'Thịt/cá (100g)',cal:180,tag:'green'},{name:'Rau (100g)',cal:30,tag:'green'}]},
    {id:'m_dinner',type:'meal',time:'18:30',label:'Tối',icon:'🍲',planned:[{name:'Thịt/cá (100g)',cal:180,tag:'green'},{name:'Rau (100g)',cal:30,tag:'green'}]},
    {id:'h_water',type:'habit',label:'Uống đủ nước',icon:'💧'},
    {id:'h_weigh',type:'habit',label:'Cân nặng sáng CN',icon:'⚖️'},
    {id:'h_prep',type:'habit',label:'Chuẩn bị đồ ăn tuần sau',icon:'🛒'},
    {id:'ex_walk',type:'exercise',label:'Vận động nhẹ',icon:'🚶',defaultEx:'Đi bộ vừa (5km/h)',defaultMin:20},
    {id:'h_sleep',type:'habit',label:'Ngủ sớm reset',icon:'😴'},
    {id:'h_steps',type:'habit',label:'Nhập steps',icon:'👟'},
    {id:'h_eufy',type:'habit',label:'Nhập chỉ số Eufy',icon:'📏'}
  ]
};

const SYM_BODY=['Chóng mặt','Mệt mỏi','Đói lả','Tim đập nhanh','Tay chân lạnh','Khó thở','Buồn nôn','Đau đầu','Đau bụng','Đau lưng','Chuột rút','Táo bón','Tiêu chảy','Đầy hơi','Hạ đường huyết','Khát nước nhiều','Đi tiểu nhiều'];
const SYM_MOOD=['Vui vẻ','Bình thường','Căng thẳng','Lo lắng','Buồn','Cáu gắt','Mất tập trung','Ngủ không ngon','Stress công việc'];
const SYM_CRAVE=['Thèm ngọt','Thèm ăn vặt','Thèm ăn đêm','Thèm trà sữa','Thèm nước ngọt','Ăn uống vô độ'];

const TIMINGS=[['morning','Buổi sáng'],['before_breakfast','Trước ăn sáng'],['after_breakfast','Sau ăn sáng'],['before_lunch','Trước ăn trưa'],['after_lunch','Sau ăn trưa'],['before_dinner','Trước ăn tối'],['after_dinner','Sau ăn tối'],['bedtime','Trước khi ngủ']];

const METRIC_DIRECTION={
  weight:{good:'down',unit:'kg',label:'Cân nặng'},
  bodyFatPct:{good:'down',unit:'%',label:'Mỡ cơ thể'},
  musclePct:{good:'up',unit:'%',label:'Cơ'},
  waterPct:{good:'up',unit:'%',label:'Nước'},
  visceralFat:{good:'down',unit:'',label:'Mỡ nội tạng'},
  bmr:{good:'neutral',unit:'kcal',label:'BMR'},
  tdee:{good:'neutral',unit:'kcal',label:'TDEE'},
  bp_sys:{good:'down',unit:'mmHg',label:'HA tâm thu'},
  bp_dia:{good:'down',unit:'mmHg',label:'HA tâm trương'},
  steps:{good:'up',unit:'bước',label:'Bước chân'},
  sleep:{good:'up',unit:'giờ',label:'Giấc ngủ'},
  calories:{good:'neutral',unit:'kcal',label:'Calo nạp'}
};

// ========== ĐƯỜNG HUYẾT ==========
const GLUCOSE_THRESHOLDS={
  'đói':{normal:5.6,pre:7.0,label:'Lúc đói'},
  'sau ăn 1h':{normal:8.9,pre:11.1,label:'Sau ăn 1h'},
  'sau ăn 2h':{normal:7.8,pre:11.1,label:'Sau ăn 2h'},
  'trước ngủ':{normal:7.8,pre:11.1,label:'Trước ngủ'},
  'ngẫu nhiên':{normal:7.8,pre:11.1,label:'Ngẫu nhiên'}
};

function glucoseRate(value, moment, unit){
  const v = unit==='mg/dL' ? value/18.018 : value;
  const t = GLUCOSE_THRESHOLDS[moment]||GLUCOSE_THRESHOLDS['ngẫu nhiên'];
  if(v < t.normal) return ['Bình thường','good'];
  if(v < t.pre) return ['Tiền tiểu đường','high'];
  return ['Tiểu đường','low'];
}

// ========== XÉT NGHIỆM ==========
const LAB_TESTS_REF=[
  {name:'HbA1c',unit:'%',min:4.0,max:5.6,warnMax:6.4,dangerMax:7.0,cat:'Tiểu đường',higherBetter:false},
  {name:'Glucose đói',unit:'mmol/L',min:3.9,max:5.5,warnMax:6.9,dangerMax:7.0,cat:'Tiểu đường',higherBetter:false},
  {name:'Insulin',unit:'μU/mL',min:2.6,max:24.9,cat:'Tiểu đường',higherBetter:false},
  {name:'Cholesterol toàn phần',unit:'mmol/L',min:3.6,max:5.2,warnMax:6.2,cat:'Mỡ máu',higherBetter:false},
  {name:'HDL (tốt)',unit:'mmol/L',min:1.0,max:null,cat:'Mỡ máu',higherBetter:true},
  {name:'LDL (xấu)',unit:'mmol/L',min:null,max:3.4,warnMax:4.1,cat:'Mỡ máu',higherBetter:false},
  {name:'Triglyceride',unit:'mmol/L',min:null,max:1.7,warnMax:2.3,cat:'Mỡ máu',higherBetter:false},
  {name:'AST (SGOT)',unit:'U/L',min:5,max:40,cat:'Gan',higherBetter:false},
  {name:'ALT (SGPT)',unit:'U/L',min:7,max:56,cat:'Gan',higherBetter:false},
  {name:'GGT',unit:'U/L',min:9,max:48,cat:'Gan',higherBetter:false},
  {name:'Creatinine',unit:'μmol/L',min:44,max:106,cat:'Thận',higherBetter:false},
  {name:'Ure',unit:'mmol/L',min:2.5,max:7.5,cat:'Thận',higherBetter:false},
  {name:'eGFR',unit:'mL/min',min:90,max:null,cat:'Thận',higherBetter:true},
  {name:'Acid uric',unit:'μmol/L',min:140,max:360,warnMax:420,cat:'Khác',higherBetter:false},
  {name:'Sắt',unit:'μmol/L',min:9,max:30,cat:'Khác',higherBetter:null},
  {name:'Ferritin',unit:'ng/mL',min:13,max:150,cat:'Khác',higherBetter:null},
  {name:'Vitamin D',unit:'ng/mL',min:30,max:100,cat:'Khác',higherBetter:true},
  {name:'TSH',unit:'mIU/L',min:0.4,max:4.0,cat:'Khác',higherBetter:null},
  {name:'Hemoglobin',unit:'g/dL',min:12,max:16,cat:'Khác',higherBetter:null},
  {name:'Hồng cầu (RBC)',unit:'T/L',min:4.0,max:5.4,cat:'Khác',higherBetter:null},
  {name:'Bạch cầu (WBC)',unit:'G/L',min:4.0,max:10.0,cat:'Khác',higherBetter:null},
  {name:'Tiểu cầu (PLT)',unit:'G/L',min:150,max:400,cat:'Khác',higherBetter:null}
];

function labRate(value, ref){
  if(!ref) return ['--','normal'];
  const v = +value;
  if(ref.min!=null && v < ref.min) return ['Thấp','low'];
  if(ref.max!=null && v > ref.max){
    if(ref.dangerMax && v >= ref.dangerMax) return ['Nguy hiểm','low'];
    return ['Cao','high'];
  }
  return ['Bình thường','good'];
}



// ========== BẢNG THAM KHẢO SỨC KHỎE ==========
// Nguồn: WHO Asia-Pacific, AHA 2020, ADA 2024, ACE, Tanita

const HEALTH_REFS = {
  bmi: {
    name: 'BMI',
    source: 'WHO Asia-Pacific 2004',
    ranges: [
      {max:18.5, label:'Gầy', color:'#ed8936', tip:'Cần tăng cân để khỏe hơn'},
      {max:23, label:'Bình thường', color:'#48bb78', tip:'Duy trì lối sống hiện tại'},
      {max:25, label:'Thừa cân', color:'#ed8936', tip:'Giảm 2-3kg để về ngưỡng bình thường'},
      {max:30, label:'Béo phì I', color:'#e53e3e', tip:'Nên giảm cân theo hướng dẫn bác sĩ'},
      {max:999, label:'Béo phì II', color:'#e53e3e', tip:'Cần can thiệp y tế + giảm cân nghiêm túc'}
    ]
  },
  bp_sys: {
    name: 'Huyết áp tâm thu',
    source: 'AHA 2020',
    ranges: [
      {max:90, label:'Thấp', color:'#ed8936', tip:'Uống đủ nước, ăn đủ muối'},
      {max:120, label:'Bình thường', color:'#48bb78', tip:''},
      {max:130, label:'Tăng nhẹ', color:'#ed8936', tip:'Giảm muối, tập thể dục đều'},
      {max:140, label:'Tăng độ 1', color:'#e53e3e', tip:'Đi khám, có thể cần thuốc'},
      {max:999, label:'Tăng độ 2', color:'#e53e3e', tip:'Đi khám ngay, dùng thuốc theo chỉ định'}
    ]
  },
  bp_dia: {
    name: 'Huyết áp tâm trương',
    source: 'AHA 2020',
    ranges: [
      {max:60, label:'Thấp', color:'#ed8936', tip:'Uống đủ nước'},
      {max:80, label:'Bình thường', color:'#48bb78', tip:''},
      {max:90, label:'Tăng độ 1', color:'#e53e3e', tip:'Đi khám'},
      {max:999, label:'Tăng độ 2', color:'#e53e3e', tip:'Đi khám ngay'}
    ]
  },
  glucose_fast: {
    name: 'Đường huyết lúc đói',
    source: 'ADA 2024',
    ranges: [
      {max:3.9, label:'Thấp', color:'#e53e3e', tip:'Ăn ngay để tăng đường huyết'},
      {max:5.6, label:'Bình thường', color:'#48bb78', tip:''},
      {max:7.0, label:'Tiền tiểu đường', color:'#ed8936', tip:'Giảm đường, tập thể dục'},
      {max:999, label:'Tiểu đường', color:'#e53e3e', tip:'Cần gặp bác sĩ Nội tiết'}
    ]
  }
};

// Các ngưỡng theo tuổi cho các chỉ số khác
const AGE_RANGES = {
  bodyFatMale: [
    {ageMax:39, low:8, normal:19, high:24, vhigh:999, source:'ACE'},
    {ageMax:59, low:11, normal:21, high:27, vhigh:999, source:'ACE'},
    {ageMax:999, low:13, normal:24, high:29, vhigh:999, source:'ACE'}
  ],
  bodyFatFemale: [
    {ageMax:39, low:21, normal:32, high:38, vhigh:999, source:'ACE'},
    {ageMax:59, low:23, normal:33, high:39, vhigh:999, source:'ACE'},
    {ageMax:999, low:24, normal:35, high:41, vhigh:999, source:'ACE'}
  ],
  muscleMale: [
    {ageMax:39, low:33, normal:39, source:'InBody'},
    {ageMax:59, low:32, normal:38, source:'InBody'},
    {ageMax:999, low:30, normal:36, source:'InBody'}
  ],
  muscleFemale: [
    {ageMax:39, low:24, normal:30, source:'InBody'},
    {ageMax:59, low:23, normal:29, source:'InBody'},
    {ageMax:999, low:21, normal:27, source:'InBody'}
  ]
};

// Placeholder mẫu cho người khỏe mạnh (1m70, 65kg, 30 tuổi)
const HEALTHY_PLACEHOLDERS = {
  height: '170',
  weight: '65',
  birthYear: (new Date().getFullYear() - 30).toString(),
  targetWeight: '63',
  bpSys: '115',
  bpDia: '75',
  bpPulse: '68',
  glucose: '5.2',
  bodyFatPct: '20',
  musclePct: '35',
  waterPct: '55',
  visceralFat: '5'
};

// Hàm đánh giá chỉ số theo bảng tham khảo
function rateByRef(value, refKey) {
  const ref = HEALTH_REFS[refKey];
  if(!ref) return null;
  const v = +value;
  for(const r of ref.ranges){
    if(v < r.max) return {label:r.label, color:r.color, tip:r.tip, source:ref.source};
  }
  const last = ref.ranges[ref.ranges.length-1];
  return {label:last.label, color:last.color, tip:last.tip, source:ref.source};
}

function rateBodyFat(pct, gender, age){
  const arr = gender==='male' ? AGE_RANGES.bodyFatMale : AGE_RANGES.bodyFatFemale;
  const ageGroup = arr.find(r => age <= r.ageMax) || arr[arr.length-1];
  const v = +pct;
  if(v < ageGroup.low) return {label:'Rất thấp', color:'#ed8936', tip:'Tăng mỡ lành mạnh', source:ageGroup.source};
  if(v <= ageGroup.normal) return {label:'Bình thường', color:'#48bb78', tip:'', source:ageGroup.source};
  if(v <= ageGroup.high) return {label:'Cao', color:'#ed8936', tip:'Giảm mỡ qua tập luyện', source:ageGroup.source};
  return {label:'Rất cao', color:'#e53e3e', tip:'Cần giảm mỡ khẩn cấp', source:ageGroup.source};
}

function rateMuscle(pct, gender, age){
  const arr = gender==='male' ? AGE_RANGES.muscleMale : AGE_RANGES.muscleFemale;
  const ageGroup = arr.find(r => age <= r.ageMax) || arr[arr.length-1];
  const v = +pct;
  if(v < ageGroup.low) return {label:'Thấp', color:'#e53e3e', tip:'Cần tăng cơ', source:ageGroup.source};
  if(v <= ageGroup.normal) return {label:'Trung bình', color:'#ed8936', tip:'Tập tạ để tăng cơ', source:ageGroup.source};
  return {label:'Tốt', color:'#48bb78', tip:'', source:ageGroup.source};
}

function getAgeFromBirthYear(by){
  if(!by) return 30;
  return new Date().getFullYear() - by;
}

// Đánh giá sức khỏe tổng quát
function assessHealth(dataObj){
  const s = dataObj.settings;
  const age = getAgeFromBirthYear(s.birthYear);
  const gender = s.gender;
  const latest = dataObj.weights && dataObj.weights.length
    ? [...dataObj.weights].sort((a,b)=>b.date.localeCompare(a.date))[0]
    : null;

  const results = [];

  // BMI
  if(latest && latest.weight && s.height){
    const h = s.height/100;
    const bmi = +(latest.weight/(h*h)).toFixed(1);
    const r = rateByRef(bmi, 'bmi');
    results.push({key:'bmi', label:'BMI', value:bmi, unit:'', ...r});
  }

  // Mỡ cơ thể
  if(latest && latest.bodyFatPct){
    const r = rateBodyFat(latest.bodyFatPct, gender, age);
    results.push({key:'bodyFat', label:'Mỡ cơ thể', value:latest.bodyFatPct, unit:'%', ...r});
  }

  // Cơ
  if(latest && latest.musclePct){
    const r = rateMuscle(latest.musclePct, gender, age);
    results.push({key:'muscle', label:'Khối cơ', value:latest.musclePct, unit:'%', ...r});
  }

  // Mỡ nội tạng
  if(latest && latest.visceralFat){
    const v = latest.visceralFat;
    let r;
    if(v <= 9) r = {label:'Tốt', color:'#48bb78', tip:'', source:'Tanita'};
    else if(v <= 14) r = {label:'Cao', color:'#ed8936', tip:'Giảm mỡ bụng', source:'Tanita'};
    else r = {label:'Rất cao', color:'#e53e3e', tip:'Nguy cơ tim mạch, cần khám', source:'Tanita'};
    results.push({key:'visceral', label:'Mỡ nội tạng', value:v, unit:'', ...r});
  }

  // HA - lấy lần đo mới nhất
  if(dataObj.days){
    const bpsAll = [];
    Object.keys(dataObj.days).forEach(dt => {
      const d = dataObj.days[dt];
      if(d.bps && d.bps.length) d.bps.forEach(bp => bpsAll.push({date:dt, ...bp}));
    });
    bpsAll.sort((a,b) => (a.date+(a.time||'')).localeCompare(b.date+(b.time||'')));
    if(bpsAll.length){
      const latest = bpsAll[bpsAll.length-1];
      const sysR = rateByRef(latest.sys, 'bp_sys');
      results.push({key:'bp_sys', label:'HA tâm thu', value:latest.sys, unit:'mmHg', ...sysR});
      const diaR = rateByRef(latest.dia, 'bp_dia');
      results.push({key:'bp_dia', label:'HA tâm trương', value:latest.dia, unit:'mmHg', ...diaR});
    }
  }

  // Đường huyết - lấy lần đo lúc đói mới nhất
  if(dataObj.days){
    const gluAll = [];
    Object.keys(dataObj.days).forEach(dt => {
      const d = dataObj.days[dt];
      if(d.glucose && d.glucose.length) d.glucose.forEach(g => gluAll.push({date:dt, ...g}));
    });
    const fasting = gluAll.filter(g => g.moment === 'đói');
    if(fasting.length){
      fasting.sort((a,b) => (a.date+(a.time||'')).localeCompare(b.date+(b.time||'')));
      const latest = fasting[fasting.length-1];
      const r = rateByRef(latest.value, 'glucose_fast');
      results.push({key:'glucose', label:'ĐH lúc đói', value:latest.value, unit:'mmol/L', ...r});
    }
  }

  return results;
}


// ========== BẢNG THAM KHẢO CHI TIẾT ==========
// Cấu trúc: mỗi bảng có id, title, icon, desc, source, columns, rows
// match: hàm trả về chỉ số dòng (0-based) mà user đang ở, hoặc -1 nếu không khớp

function getAgeFromBirthYear(by){
  if(!by) return null;
  return new Date().getFullYear() - by;
}

function getLatestWeightSimple(){
  if(!data.weights || !data.weights.length) return null;
  return [...data.weights].sort((a,b)=>b.date.localeCompare(a.date))[0];
}

function getLatestBpSimple(){
  if(!data.days) return null;
  const arr = [];
  Object.keys(data.days).forEach(dt => {
    const day = data.days[dt];
    if(day.bps && day.bps.length) day.bps.forEach(bp => arr.push({date:dt, ...bp}));
  });
  if(!arr.length) return null;
  arr.sort((a,b)=>(a.date+(a.time||'')).localeCompare(b.date+(b.time||'')));
  return arr[arr.length-1];
}

function getLatestGlucoseSimple(){
  if(!data.days) return null;
  const arr = [];
  Object.keys(data.days).forEach(dt => {
    const day = data.days[dt];
    if(day.glucose && day.glucose.length) day.glucose.forEach(g => arr.push({date:dt, ...g}));
  });
  if(!arr.length) return null;
  arr.sort((a,b)=>(a.date+(a.time||'')).localeCompare(b.date+(b.time||'')));
  return arr[arr.length-1];
}

const REF_TABLES = [
  // ===== 1. BMI =====
  {
    id: 'bmi',
    title: 'Chỉ số khối cơ thể (BMI)',
    icon: '⚖️',
    desc: 'Đánh giá mức độ cân nặng so với chiều cao. Công thức: BMI = Cân nặng (kg) / Chiều cao² (m)',
    source: 'WHO Asia-Pacific 2004',
    columns: ['Phân loại', 'BMI (kg/m²)', 'Ý nghĩa'],
    rows: [
      {values:['Gầy', '< 18.5', 'Cần tăng cân'], color:'#ed8936'},
      {values:['Bình thường', '18.5 - 22.9', 'Duy trì lối sống'], color:'#48bb78'},
      {values:['Thừa cân', '23 - 24.9', 'Nên giảm 2-3kg'], color:'#ed8936'},
      {values:['Béo phì độ I', '25 - 29.9', 'Cần giảm cân'], color:'#e53e3e'},
      {values:['Béo phì độ II', '≥ 30', 'Cần can thiệp y tế'], color:'#e53e3e'}
    ],
    match: function(){
      const w = getLatestWeightSimple();
      const h = data.settings && data.settings.height;
      if(!w || !h) return -1;
      const bmi = w.weight / Math.pow(h/100, 2);
      if(bmi < 18.5) return 0;
      if(bmi < 23) return 1;
      if(bmi < 25) return 2;
      if(bmi < 30) return 3;
      return 4;
    },
    userValue: function(){
      const w = getLatestWeightSimple();
      const h = data.settings && data.settings.height;
      if(!w || !h) return null;
      return (w.weight / Math.pow(h/100, 2)).toFixed(1);
    }
  },

  // ===== 2. Huyết áp =====
  {
    id: 'bp',
    title: 'Huyết áp (người lớn ≥ 18 tuổi)',
    icon: '🩸',
    desc: 'Áp lực máu lên thành động mạch. Đo khi ngồi nghỉ 5 phút, không uống cà phê trước 30 phút.',
    source: 'American Heart Association 2020',
    columns: ['Phân loại', 'Tâm thu (mmHg)', 'Tâm trương (mmHg)', 'Lưu ý'],
    rows: [
      {values:['Huyết áp thấp', '< 90', 'hoặc < 60', 'Uống đủ nước'], color:'#ed8936'},
      {values:['Bình thường', '< 120', 'và < 80', 'Lý tưởng'], color:'#48bb78'},
      {values:['Tăng nhẹ', '120 - 129', 'và < 80', 'Theo dõi định kỳ'], color:'#ed8936'},
      {values:['Tăng độ 1', '130 - 139', 'hoặc 80 - 89', 'Nên đi khám'], color:'#e53e3e'},
      {values:['Tăng độ 2', '≥ 140', 'hoặc ≥ 90', 'Đi khám ngay'], color:'#e53e3e'},
      {values:['Khủng hoảng', '≥ 180', 'và/hoặc ≥ 120', 'Cấp cứu ngay'], color:'#742a2a'}
    ],
    match: function(){
      const bp = getLatestBpSimple();
      if(!bp) return -1;
      const s = bp.sys, d = bp.dia;
      if(s >= 180 || d >= 120) return 5;
      if(s >= 140 || d >= 90) return 4;
      if(s >= 130 || d >= 80) return 3;
      if(s >= 120 && d < 80) return 2;
      if(s < 90 || d < 60) return 0;
      return 1;
    },
    userValue: function(){
      const bp = getLatestBpSimple();
      return bp ? bp.sys+'/'+bp.dia : null;
    }
  },

  // ===== 3. Nhịp tim nghỉ theo tuổi =====
  {
    id: 'hr',
    title: 'Nhịp tim nghỉ (theo tuổi)',
    icon: '❤️',
    desc: 'Số lần tim đập/phút khi nghỉ ngơi hoàn toàn. Cách đo: ngồi nghỉ 5-10 phút, đếm mạch trong 30 giây × 2.',
    source: 'American Heart Association',
    columns: ['Tuổi', 'Nhịp tim nghỉ tốt (bpm)', 'Ghi chú'],
    rows: [
      {values:['18-25', '56-65', 'Người khỏe'], color:'#48bb78'},
      {values:['26-35', '55-64', 'Người khỏe'], color:'#48bb78'},
      {values:['36-45', '54-63', 'Người khỏe'], color:'#48bb78'},
      {values:['46-55', '53-62', 'Người khỏe'], color:'#48bb78'},
      {values:['56-65', '52-61', 'Người khỏe'], color:'#48bb78'},
      {values:['Trên 65', '50-60', 'Người khỏe'], color:'#48bb78'}
    ],
    match: function(){
      const age = getAgeFromBirthYear(data.settings && data.settings.birthYear);
      const bp = getLatestBpSimple();
      // CHỈ highlight nếu CÓ đo pulse
      if(!age || !bp || !bp.pulse) return -1;
      // Xác định nhóm tuổi
      let ageIdx;
      if(age <= 25) ageIdx = 0;
      else if(age <= 35) ageIdx = 1;
      else if(age <= 45) ageIdx = 2;
      else if(age <= 55) ageIdx = 3;
      else if(age <= 65) ageIdx = 4;
      else ageIdx = 5;
      // Kiểm tra pulse có nằm trong ngưỡng khỏe không
      const ranges = [[56,65],[55,64],[54,63],[53,62],[52,61],[50,60]];
      const [min,max] = ranges[ageIdx];
      if(bp.pulse >= min && bp.pulse <= max) return ageIdx;
      return -1;  // Pulse ngoài ngưỡng → không highlight
    },
    userValue: function(){
      const bp = getLatestBpSimple();
      if(!bp || !bp.pulse) return null;
      const age = getAgeFromBirthYear(data.settings && data.settings.birthYear);
      if(!age) return bp.pulse + ' bpm';
      let ageIdx;
      if(age <= 25) ageIdx = 0;
      else if(age <= 35) ageIdx = 1;
      else if(age <= 45) ageIdx = 2;
      else if(age <= 55) ageIdx = 3;
      else if(age <= 65) ageIdx = 4;
      else ageIdx = 5;
      const ranges = [[56,65],[55,64],[54,63],[53,62],[52,61],[50,60]];
      const [min,max] = ranges[ageIdx];
      if(bp.pulse < min) return bp.pulse + ' bpm (thấp hơn)';
      if(bp.pulse > max) return bp.pulse + ' bpm (cao hơn)';
      return bp.pulse + ' bpm ✓';
    }
  },

  // ===== 4. Mỡ cơ thể (theo giới + tuổi) =====
  {
    id: 'bodyfat',
    title: 'Tỷ lệ mỡ cơ thể (theo giới và tuổi)',
    icon: '📊',
    desc: 'Tỷ lệ phần trăm mỡ trong cơ thể. Đo bằng cân điện tử có chức năng BIA.',
    source: 'American Council on Exercise (ACE)',
    columns: ['Giới / Tuổi', 'Thấp', 'Bình thường', 'Cao', 'Rất cao'],
    rows: [
      {values:['Nam 20-39', '< 8%', '8-19%', '20-24%', '≥ 25%'], color:'#667eea'},
      {values:['Nam 40-59', '< 11%', '11-21%', '22-27%', '≥ 28%'], color:'#667eea'},
      {values:['Nam 60+', '< 13%', '13-24%', '25-29%', '≥ 30%'], color:'#667eea'},
      {values:['Nữ 20-39', '< 21%', '21-32%', '33-38%', '≥ 39%'], color:'#ed64a6'},
      {values:['Nữ 40-59', '< 23%', '23-33%', '34-39%', '≥ 40%'], color:'#ed64a6'},
      {values:['Nữ 60+', '< 24%', '24-35%', '36-41%', '≥ 42%'], color:'#ed64a6'}
    ],
    match: function(){
      const w = getLatestWeightSimple();
      if(!w || !w.bodyFatPct) return -1;
      const gender = data.settings && data.settings.gender;
      const age = getAgeFromBirthYear(data.settings && data.settings.birthYear);
      if(!gender || !age) return -1;
      const pct = w.bodyFatPct;
      if(gender === 'male'){
        if(age <= 39) return 0;
        if(age <= 59) return 1;
        return 2;
      } else {
        if(age <= 39) return 3;
        if(age <= 59) return 4;
        return 5;
      }
    },
    userValue: function(){
      const w = getLatestWeightSimple();
      return w && w.bodyFatPct ? w.bodyFatPct+'%' : null;
    }
  },

  // ===== 5. Khối cơ =====
  {
    id: 'muscle',
    title: 'Khối lượng cơ (theo giới và tuổi)',
    icon: '💪',
    desc: 'Tỷ lệ khối cơ trong cơ thể. Càng cao càng tốt cho trao đổi chất và sức khỏe.',
    source: 'InBody / Tanita',
    columns: ['Giới / Tuổi', 'Thấp', 'Bình thường', 'Tốt'],
    rows: [
      {values:['Nam 20-39', '< 33%', '33-39%', '> 39%'], color:'#4299e1'},
      {values:['Nam 40-59', '< 32%', '32-38%', '> 38%'], color:'#4299e1'},
      {values:['Nam 60+', '< 30%', '30-36%', '> 36%'], color:'#4299e1'},
      {values:['Nữ 20-39', '< 24%', '24-30%', '> 30%'], color:'#ed64a6'},
      {values:['Nữ 40-59', '< 23%', '23-29%', '> 29%'], color:'#ed64a6'},
      {values:['Nữ 60+', '< 21%', '21-27%', '> 27%'], color:'#ed64a6'}
    ],
    match: function(){
      const w = getLatestWeightSimple();
      if(!w || !w.musclePct) return -1;
      const gender = data.settings && data.settings.gender;
      const age = getAgeFromBirthYear(data.settings && data.settings.birthYear);
      if(!gender || !age) return -1;
      if(gender === 'male'){
        if(age <= 39) return 0;
        if(age <= 59) return 1;
        return 2;
      } else {
        if(age <= 39) return 3;
        if(age <= 59) return 4;
        return 5;
      }
    },
    userValue: function(){
      const w = getLatestWeightSimple();
      return w && w.musclePct ? w.musclePct+'%' : null;
    }
  },

  // ===== 6. Nước cơ thể =====
  {
    id: 'water',
    title: 'Tỷ lệ nước trong cơ thể',
    icon: '💧',
    desc: 'Nước chiếm phần lớn cơ thể. Đo bằng cân BIA. Uống đủ nước giúp chỉ số này ổn định.',
    source: 'Tanita reference',
    columns: ['Giới', 'Thấp', 'Bình thường', 'Cao'],
    rows: [
      {values:['Nam', '< 50%', '50-65%', '> 65%'], color:'#4299e1'},
      {values:['Nữ', '< 45%', '45-60%', '> 60%'], color:'#ed64a6'}
    ],
    match: function(){
      const w = getLatestWeightSimple();
      if(!w || !w.waterPct) return -1;
      const gender = data.settings && data.settings.gender;
      if(!gender) return -1;
      return gender === 'male' ? 0 : 1;
    },
    userValue: function(){
      const w = getLatestWeightSimple();
      return w && w.waterPct ? w.waterPct+'%' : null;
    }
  },

  // ===== 7. Mỡ nội tạng =====
  {
    id: 'visceral',
    title: 'Mỡ nội tạng',
    icon: '🫀',
    desc: 'Mỡ bao quanh các cơ quan nội tạng (tim, gan, thận). Cao → nguy cơ tim mạch, tiểu đường. Đo bằng cân điện tử.',
    source: 'Tanita reference range',
    columns: ['Mức', 'Chỉ số', 'Ý nghĩa'],
    rows: [
      {values:['Tốt', '1 - 9', 'An toàn'], color:'#48bb78'},
      {values:['Cao', '10 - 14', 'Nên giảm mỡ bụng'], color:'#ed8936'},
      {values:['Rất cao', '≥ 15', 'Nguy cơ cao, cần khám'], color:'#e53e3e'}
    ],
    match: function(){
      const w = getLatestWeightSimple();
      if(!w || !w.visceralFat) return -1;
      const v = w.visceralFat;
      if(v <= 9) return 0;
      if(v <= 14) return 1;
      return 2;
    },
    userValue: function(){
      const w = getLatestWeightSimple();
      return w && w.visceralFat ? w.visceralFat : null;
    }
  },

  // ===== 8. Đường huyết =====
  {
    id: 'glucose',
    title: 'Đường huyết',
    icon: '🍬',
    desc: 'Lượng glucose trong máu. Đo lúc đói (sáng chưa ăn) là chính xác nhất.',
    source: 'American Diabetes Association 2024',
    columns: ['Thời điểm', 'Bình thường', 'Tiền tiểu đường', 'Tiểu đường'],
    rows: [
      {values:['Lúc đói (mmol/L)', '3.9 - 5.5', '5.6 - 6.9', '≥ 7.0'], color:'#e53e3e'},
      {values:['Sau ăn 2h (mmol/L)', '< 7.8', '7.8 - 11.0', '≥ 11.1'], color:'#e53e3e'},
      {values:['HbA1c (%)', '< 5.7', '5.7 - 6.4', '≥ 6.5'], color:'#e53e3e'}
    ],
    match: function(){
      const g = getLatestGlucoseSimple();
      if(!g) return -1;
      if(g.moment === 'đói') return 0;
      if(g.moment === 'sau ăn 2h') return 1;
      return -1;
    },
    userValue: function(){
      const g = getLatestGlucoseSimple();
      if(!g) return null;
      const unit = data.glucoseUnit || 'mmol/L';
      return g.value + ' ' + unit + ' (' + g.moment + ')';
    }
  }
];

// Helper: lấy bảng theo id
function getRefTable(id){
  return REF_TABLES.find(t => t.id === id);
}