var KOONGTUNG_TRANSLATIONS = {
  en: {
    "nav.home": "Home",
    "nav.about": "About Us",
    "nav.branches": "Branches",
    "nav.menu": "Menu",
    "nav.promotion": "Promotions & Membership",
    "nav.reviews": "Reviews",
    "nav.contact": "Contact",
    "nav.links": "All Links",

    "hero.badge": "5 Branches Across Bangkok & Greater Area",
    "btn.viewMenu": "View Menu",
    "btn.viewBranches": "View All Branches",

    "info.branches5": "5 Branches Across Bangkok",
    "info.openDaily": "Open Every Day",

    "about.title": "The First American-Style Seafood Boil in Thailand",
    "about.p": "KOONGTUNG is a California-style Bar & Seafood Restaurant — Thailand's first seafood boil restaurant, serving since 2015 with our own secret-recipe Bang Bang sauce. We keep the authentic American spirit while blending in Thai spices for a flavor loved by Thai and international guests alike.",
    "about.li1": "Premium ingredients — white shrimp, river prawns, clams, New Zealand mussels, blue crab, squid, and seasonal specialties",
    "about.li2": "Our secret-recipe Bang Bang sauce — adjust the spice level to your taste",
    "about.li3": "Dine-in, delivery, boxed sets, and off-site catering available",
    "about.btn": "Read Our Story",

    "branches.title": "Popular Branches",
    "branches.p": "Choose the branch nearest you, with phone numbers for advance orders",
    "br1.name": "Banthadthong Branch",
    "br3.name": "Ramindra Expressway Market Branch",
    "br2.name": "Paragon Food Court Branch",
    "branches.btnAll": "View All Branches (5 Branches)",

    "menu.title": "Recommended Menu",
    "menu.p": "Signature soy-marinated shrimp, great-value sets, and fresh seafood daily",
    "menu.btnAll": "View Full Menu",

    "cta.title": "Delivery Available at Every Branch",
    "cta.p": "Order via Lineman, Oho, or call ahead directly to your nearest branch",
    "cta.btnPromo": "View Promotions & Delivery",
    "cta.btnContact": "Contact Us",

    "footer.desc": "KOONGTUNG is Thailand's first American-style Seafood Boil restaurant (Bar & Seafood Restaurant · California Style), serving since 2015 with our 100% original Bang Bang sauce — spice level adjustable to your taste.",
    "footer.quicklinks": "Quick Links",
    "footer.linkBranches": "All Branches",
    "footer.linkMenu": "Menu",
    "footer.linkPromo": "Promotions",
    "footer.linkContact": "Contact Us",
    "footer.contactTitle": "Contact",
    "footer.phoneLabel": "Tel",
    "footer.lineLabel": "Line",
    "footer.fbLabel": "Facebook"
  },
  zh: {
    "nav.home": "首页",
    "nav.about": "关于我们",
    "nav.branches": "分店",
    "nav.menu": "菜单",
    "nav.promotion": "优惠与会员",
    "nav.reviews": "评价",
    "nav.contact": "联系我们",
    "nav.links": "全部链接",

    "hero.badge": "曼谷及周边地区5家分店",
    "btn.viewMenu": "查看菜单",
    "btn.viewBranches": "查看所有分店",

    "info.branches5": "曼谷5家分店",
    "info.openDaily": "每日营业",

    "about.title": "泰国首家美式海鲜煮",
    "about.p": "KOONGTUNG（滚桶海鲜）是加州风格的酒吧海鲜餐厅——泰国第一家海鲜煮餐厅，自2015年起为您呈上独家秘制Bang Bang酱汁。我们保留了正宗的美式风味，并融入泰式香料，深受泰国及各国顾客喜爱。",
    "about.li1": "优质食材——白虾、河虾、蛤蜊、新西兰青口贝、花蟹、鱿鱼及时令特色食材",
    "about.li2": "独家秘制Bang Bang酱汁——可根据口味调整辣度",
    "about.li3": "提供堂食、外送、套餐盒及外烩服务",
    "about.btn": "阅读我们的故事",

    "branches.title": "人气分店",
    "branches.p": "选择离您最近的分店，并提前致电预订",
    "br1.name": "班塔通分店",
    "br3.name": "兰甲高速公路市场分店",
    "br2.name": "暹罗百丽宫美食广场分店",
    "branches.btnAll": "查看所有分店（5家）",

    "menu.title": "推荐菜单",
    "menu.p": "秘制酱油虾、超值套餐，每日新鲜海鲜",
    "menu.btnAll": "查看完整菜单",

    "cta.title": "全部分店均提供外送服务",
    "cta.p": "可通过Lineman、Oho订购，或直接致电最近的分店预订",
    "cta.btnPromo": "查看优惠与外送",
    "cta.btnContact": "联系我们",

    "footer.desc": "KOONGTUNG（滚桶海鲜）是泰国首家美式海鲜煮餐厅（酒吧海鲜餐厅·加州风格），自2015年起营业，采用100%原创Bang Bang酱汁，辣度可根据您的喜好调整。",
    "footer.quicklinks": "快捷链接",
    "footer.linkBranches": "所有分店",
    "footer.linkMenu": "菜单",
    "footer.linkPromo": "优惠活动",
    "footer.linkContact": "联系我们",
    "footer.contactTitle": "联系方式",
    "footer.phoneLabel": "电话",
    "footer.lineLabel": "Line",
    "footer.fbLabel": "Facebook"
  }
};

function koongtungApplyLanguage(lang) {
  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    if (lang === "th") return; // Thai is the default markup content, nothing to swap
    var dict = KOONGTUNG_TRANSLATIONS[lang];
    var key = el.getAttribute("data-i18n");
    if (dict && dict[key]) el.textContent = dict[key];
  });
  document.querySelectorAll(".lang-switch [data-lang]").forEach(function (btn) {
    btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
  });
  document.documentElement.setAttribute("lang", lang === "en" ? "en" : (lang === "zh" ? "zh" : "th"));
}

function koongtungSetLanguage(lang) {
  localStorage.setItem("koongtung-lang", lang);
  koongtungApplyLanguage(lang);
}

(function () {
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-lang]");
    if (!btn) return;
    koongtungSetLanguage(btn.getAttribute("data-lang"));
  });
  var saved = localStorage.getItem("koongtung-lang") || "th";
  koongtungApplyLanguage(saved);
})();
