const products = [
  { brand: "SMARTSPACE SELECT", name: "Nova Pro 256", price: 719990, category: "flagship", badge: "Хит", art: "art-lilac", phone: "", storage: "256 ГБ", camera: "50 Мп", battery: "18 ч" },
  { brand: "SMARTSPACE SELECT", name: "Nova Air", price: 449990, category: "middle", badge: "Новинка", art: "art-mint", phone: "phone-green", storage: "256 ГБ", camera: "50 Мп", battery: "16 ч" },
  { brand: "SMARTSPACE SELECT", name: "Pixel Studio X", price: 899990, category: "flagship", badge: "Премиум", art: "art-peach", phone: "phone-orange", storage: "512 ГБ", camera: "108 Мп", battery: "20 ч" },
  { brand: "SMARTSPACE SELECT", name: "One Mini", price: 239990, category: "budget", badge: "Выгодно", art: "art-blue", phone: "phone-blue", storage: "128 ГБ", camera: "48 Мп", battery: "14 ч" },
  { brand: "SMARTSPACE SELECT", name: "Nova Play", price: 539990, category: "middle", badge: "Для игр", art: "art-rose", phone: "phone-pink", storage: "512 ГБ", camera: "64 Мп", battery: "19 ч" },
  { brand: "SMARTSPACE SELECT", name: "One Lite", price: 169990, category: "budget", badge: "Доступный", art: "art-mint", phone: "phone-green", storage: "128 ГБ", camera: "32 Мп", battery: "12 ч" },
  { brand: "SMARTSPACE SELECT", name: "Nova Ultra", price: 1079990, category: "flagship", badge: "Флагман", art: "art-blue", phone: "phone-blue", storage: "512 ГБ", camera: "108 Мп", battery: "22 ч" },
  { brand: "SMARTSPACE SELECT", name: "One Core", price: 299990, category: "budget", badge: "Выбор дня", art: "art-peach", phone: "phone-orange", storage: "256 ГБ", camera: "50 Мп", battery: "15 ч" }
];

const reportEntries = [];
const viewTitles = {
  home: "Главная",
  catalog: "Каталог",
  content: "Статьи и видео",
  purchase: "Покупка и скидки",
  recommend: "Подбор смартфона",
  services: "Услуги",
  account: "Аккаунт и доступ",
  admin: "Админ-панель",
  finances: "Финансы",
  security: "Безопасность",
  report: "Мой отчёт"
};
const postsStorageKey = "smartspace-posts";
const postTypeLabels = { article: "Статья", photo: "Фото", video: "Видео", ad: "Реклама" };
const numberFormat = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 });
const tenge = (value) => `${numberFormat.format(value)} ₸`;
const one = (selector, root = document) => root.querySelector(selector);
const all = (selector, root = document) => [...root.querySelectorAll(selector)];
let posts = [];
let isAdminAuthenticated = false;
let editingPostId = null;
let postsLoadError = "";

function showView(name) {
  if (!viewTitles[name]) return;
  if (name === "admin" && !isAdminAuthenticated) {
    showView("account");
    showResult("#login-result", "Для доступа к админ-панели войдите под демо-аккаунтом администратора.", "warning");
    return;
  }
  all(".view").forEach((view) => view.classList.toggle("active", view.id === `view-${name}`));
  all(".nav-link").forEach((link) => link.classList.toggle("active", link.dataset.view === name));
  one("#page-title").textContent = viewTitles[name];
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function addReport(title, details) {
  reportEntries.unshift({
    title,
    details,
    time: new Intl.DateTimeFormat("ru-RU", { dateStyle: "short", timeStyle: "short" }).format(new Date())
  });
  renderReport();
}

function renderReport() {
  const list = one("#report-list");
  list.replaceChildren();
  one("#report-count").textContent = String(reportEntries.length);
  const total = reportEntries.length;
  one("#report-total").textContent = `${total} ${total === 1 ? "действие" : total > 1 && total < 5 ? "действия" : "действий"}`;
  if (total === 0) {
    const empty = document.createElement("div");
    empty.className = "report-empty";
    empty.textContent = "Пока нет выполненных расчётов. Результаты появятся здесь.";
    list.append(empty);
    return;
  }
  reportEntries.forEach((entry) => {
    const card = document.createElement("article");
    card.className = "report-entry";
    const heading = document.createElement("div");
    heading.className = "report-entry-top";
    const title = document.createElement("div");
    title.className = "report-entry-title";
    title.textContent = entry.title;
    const time = document.createElement("time");
    time.className = "report-entry-time";
    time.textContent = entry.time;
    heading.append(title, time);
    const details = document.createElement("div");
    details.className = "report-entry-details";
    details.textContent = entry.details;
    card.append(heading, details);
    list.append(card);
  });
}

function showResult(selector, text, tone = "success") {
  const result = one(selector);
  result.textContent = text;
  result.className = `result-box result-${tone}`;
  result.hidden = false;
}

function field(form, name) {
  return form.elements.namedItem(name);
}

function isValidPost(post) {
  const validFields = post && typeof post.id === "string"
    && ["article", "photo", "video", "ad"].includes(post.type)
    && typeof post.title === "string" && typeof post.text === "string"
    && typeof post.mediaUrl === "string" && typeof post.featured === "boolean"
    && typeof post.createdAt === "string";
  if (!validFields || !post.mediaUrl) return Boolean(validFields);
  try {
    const url = new URL(post.mediaUrl);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

function readPosts() {
  try {
    const stored = window.localStorage.getItem(postsStorageKey);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) throw new Error("Ожидался список публикаций.");
    const validPosts = parsed.filter(isValidPost);
    if (validPosts.length !== parsed.length) {
      postsLoadError = "Некоторые сохранённые публикации повреждены и не были загружены.";
    }
    return validPosts;
  } catch (error) {
    postsLoadError = "Не удалось прочитать публикации из хранилища браузера.";
    console.error(postsLoadError, error);
    return [];
  }
}

function savePosts(nextPosts) {
  try {
    window.localStorage.setItem(postsStorageKey, JSON.stringify(nextPosts));
    posts = nextPosts;
    postsLoadError = "";
    return true;
  } catch (error) {
    console.error("Не удалось сохранить публикации.", error);
    showResult("#admin-message", "Не удалось сохранить изменения. Проверьте доступность хранилища браузера.", "danger");
    return false;
  }
}

function createPostCard(post, adminMode = false) {
  const card = document.createElement("article");
  card.className = `content-card${post.featured ? " content-card-featured" : ""}`;
  const type = document.createElement("span");
  type.className = "content-type";
  type.textContent = post.featured ? "Рекламный пост" : postTypeLabels[post.type];
  card.append(type);

  if (post.mediaUrl) {
    const url = new URL(post.mediaUrl);
    if (/\.(avif|gif|jpe?g|png|webp)$/i.test(url.pathname)) {
      const image = document.createElement("img");
      image.className = "content-media";
      image.src = url.href;
      image.alt = post.title;
      image.loading = "lazy";
      card.append(image);
    } else if (/\.(mp4|ogg|webm)$/i.test(url.pathname)) {
      const video = document.createElement("video");
      video.className = "content-media";
      video.controls = true;
      video.preload = "metadata";
      const source = document.createElement("source");
      source.src = url.href;
      video.append(source);
      card.append(video);
    } else {
      const mediaLink = document.createElement("a");
      mediaLink.className = "content-media-link";
      mediaLink.href = url.href;
      mediaLink.target = "_blank";
      mediaLink.rel = "noopener noreferrer";
      mediaLink.textContent = post.type === "video" ? "Смотреть видео ↗" : "Открыть материал ↗";
      card.append(mediaLink);
    }
  }

  const title = document.createElement("h2");
  title.textContent = post.title;
  const text = document.createElement("p");
  text.className = "content-card-text";
  text.textContent = post.text;
  const date = document.createElement("time");
  date.className = "content-card-date";
  const createdAt = new Date(post.createdAt);
  date.dateTime = Number.isNaN(createdAt.getTime()) ? "" : createdAt.toISOString();
  date.textContent = Number.isNaN(createdAt.getTime())
    ? "Дата не указана"
    : new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium" }).format(createdAt);
  card.append(title, text, date);

  if (adminMode) {
    const actions = document.createElement("div");
    actions.className = "content-card-actions";
    const edit = document.createElement("button");
    edit.className = "button button-outline";
    edit.type = "button";
    edit.textContent = "Изменить";
    edit.addEventListener("click", () => editPost(post));
    const remove = document.createElement("button");
    remove.className = "button button-outline";
    remove.type = "button";
    remove.textContent = "Удалить";
    remove.addEventListener("click", () => deletePost(post.id));
    actions.append(edit, remove);
    card.append(actions);
  }
  return card;
}

function renderPosts() {
  const feed = one("#content-posts");
  const empty = one("#content-empty");
  const adminList = one("#admin-posts");
  feed.replaceChildren();
  adminList.replaceChildren();
  empty.hidden = posts.length > 0;
  posts.forEach((post) => {
    feed.append(createPostCard(post));
    adminList.append(createPostCard(post, true));
  });
  one("#admin-post-count").textContent = `${posts.length} ${posts.length === 1 ? "материал" : posts.length > 1 && posts.length < 5 ? "материала" : "материалов"}`;

  const adSlot = one("#home-ad");
  adSlot.replaceChildren();
  const featuredPost = posts.find((post) => post.featured);
  adSlot.hidden = !featuredPost;
  if (featuredPost) {
    const label = document.createElement("div");
    label.className = "ad-slot-label";
    label.textContent = "Рекламная публикация";
    adSlot.append(label, createPostCard(featuredPost));
    const readMore = document.createElement("button");
    readMore.className = "text-link";
    readMore.type = "button";
    readMore.textContent = "Все статьи и публикации →";
    readMore.addEventListener("click", () => showView("content"));
    adSlot.append(readMore);
  }
}

function resetPostForm() {
  one("#post-form").reset();
  editingPostId = null;
  one("#post-form-title").textContent = "Новая публикация";
  one("#publish-post").textContent = "Опубликовать";
  one("#cancel-edit").hidden = true;
}

function editPost(post) {
  const form = one("#post-form");
  field(form, "type").value = post.type;
  field(form, "title").value = post.title;
  field(form, "text").value = post.text;
  field(form, "mediaUrl").value = post.mediaUrl;
  field(form, "featured").checked = post.featured;
  editingPostId = post.id;
  one("#post-form-title").textContent = "Редактирование публикации";
  one("#publish-post").textContent = "Сохранить изменения";
  one("#cancel-edit").hidden = false;
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function deletePost(id) {
  if (!window.confirm("Удалить эту публикацию?")) return;
  const nextPosts = posts.filter((post) => post.id !== id);
  if (savePosts(nextPosts)) {
    renderPosts();
    showResult("#admin-message", "Публикация удалена.", "success");
  }
}

function phoneCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";
  const art = document.createElement("div");
  art.className = `product-art ${product.art}`;
  const badge = document.createElement("span");
  badge.className = "product-badge";
  badge.textContent = product.badge;
  const phone = document.createElement("div");
  phone.className = `mini-phone ${product.phone}`;
  art.append(badge, phone);
  const info = document.createElement("div");
  info.className = "product-info";
  const brand = document.createElement("div");
  brand.className = "product-brand";
  brand.textContent = product.brand;
  const name = document.createElement("h3");
  name.textContent = product.name;
  const meta = document.createElement("div");
  meta.className = "product-meta";
  [product.storage, product.camera, product.battery].forEach((value) => {
    const tag = document.createElement("span");
    tag.textContent = value;
    meta.append(tag);
  });
  const bottom = document.createElement("div");
  bottom.className = "product-bottom";
  const price = document.createElement("span");
  price.className = "product-price";
  price.textContent = tenge(product.price);
  const buy = document.createElement("button");
  buy.className = "product-buy";
  buy.type = "button";
  buy.textContent = "↗";
  buy.setAttribute("aria-label", `Рассчитать покупку: ${product.name}`);
  buy.addEventListener("click", () => {
    showView("purchase");
    const amount = one('#purchase-form [name="amount"]');
    amount.value = product.price;
    amount.focus();
  });
  bottom.append(price, buy);
  info.append(brand, name, meta, bottom);
  card.append(art, info);
  return card;
}

function renderProducts() {
  const featured = one("#featured-products");
  const catalog = one("#catalog-products");
  products.slice(0, 4).forEach((product) => featured.append(phoneCard(product)));
  products.forEach((product) => catalog.append(phoneCard(product)));
}

function calculateDiscount(amount, loyalty) {
  let rate = 0;
  if (amount >= 600000) rate = loyalty ? 0.15 : 0.1;
  else if (amount >= 300000) rate = loyalty ? 0.1 : 0.05;
  else if (loyalty) rate = 0.05;
  const discount = amount * rate;
  return `Скидка: ${rate * 100}% (${tenge(discount)}). К оплате: ${tenge(amount - discount)}.`;
}

function assessProductScore(score) {
  if (score >= 85) return "Оценка A — отличный выбор, смартфон соответствует высоким требованиям.";
  if (score >= 65) return "Оценка B — хороший выбор, проверь характеристики, важные именно для тебя.";
  if (score >= 40) return "Оценка C — базовый вариант, сравни его с другими моделями.";
  return "Оценка D — рекомендуем подобрать другую модель.";
}

function getRecommendation(age, budget, storage, battery, camera, gaming) {
  let score = 0;
  if (budget >= 600000) score += 2;
  else if (budget >= 300000) score++;
  if (storage >= 256) score++;
  if (battery >= 12) score++;
  if (camera >= 50) score++;
  if (gaming) score++;
  const level = score >= 5 ? "высокий" : score >= 3 ? "средний" : "базовый";
  let recommendation;
  if (age < 18) recommendation = "доступный смартфон с участием взрослого при оформлении";
  else if (budget >= 600000 && gaming && storage >= 256) recommendation = "флагман для игр с памятью от 256 ГБ";
  else if (budget >= 600000 && camera >= 50) recommendation = "флагман с продвинутой камерой";
  else if (budget >= 600000) recommendation = "флагман с расширенной гарантией";
  else if (budget >= 300000 && gaming) recommendation = "производительная модель среднего класса";
  else if (budget >= 300000) recommendation = "сбалансированная модель с хорошей камерой";
  else recommendation = "надёжная базовая модель в пределах бюджета";
  return `Итоговый уровень: ${level} (${score} баллов из 6).\nРекомендация: ${recommendation}.`;
}

all("[data-view]").forEach((button) => {
  button.addEventListener("click", () => showView(button.dataset.view));
});

all("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    all("[data-filter]").forEach((chip) => chip.classList.toggle("selected", chip === button));
    const category = button.dataset.filter;
    const shown = category === "all" ? products : products.filter((product) => product.category === category);
    const catalog = one("#catalog-products");
    catalog.replaceChildren(...shown.map(phoneCard));
  });
});

one("#purchase-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const amount = Number(field(form, "amount").value);
  const loyalty = field(form, "loyalty").checked;
  const age = Number(field(form, "age").value);
  const budget = Number(field(form, "budget").value);
  const active = field(form, "active").checked;
  const blocked = field(form, "blocked").checked;
  const discount = calculateDiscount(amount, loyalty);
  const promotion = amount >= 300000 || loyalty
    ? "Доступно специальное предложение программы лояльности."
    : "Для специального предложения нужна покупка от 300 000 ₸ или карта лояльности.";
  let decision;
  let tone = "success";
  if (blocked) {
    decision = "Покупка приостановлена: аккаунт заблокирован.";
    tone = "danger";
  } else if (age < 18) {
    decision = "Для покупки несовершеннолетнему потребуется участие взрослого.";
    tone = "warning";
  } else if (!active) {
    decision = "Покупка недоступна: сначала активируй аккаунт.";
    tone = "warning";
  } else if (amount > budget && !loyalty) {
    decision = "Сумма превышает бюджет; проверь рассрочку или выбери другую модель.";
    tone = "warning";
  } else if (amount > budget) {
    decision = "Предложение одобрено условно: проверь доступность рассрочки.";
    tone = "warning";
  } else {
    decision = `Покупка одобрена. ${discount}`;
  }
  const result = `${discount}\n${promotion}\nРешение: ${decision}`;
  showResult("#purchase-result", result, tone);
  addReport("Расчёт покупки", result);
});

one("#recommend-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const result = getRecommendation(
    Number(field(form, "age").value),
    Number(field(form, "budget").value),
    Number(field(form, "storage").value),
    Number(field(form, "battery").value),
    Number(field(form, "camera").value),
    field(form, "gaming").checked
  );
  showResult("#recommend-result", result);
  addReport("Персональная рекомендация смартфона", result);
});

one("#score-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const result = assessProductScore(Number(field(event.currentTarget, "score").value));
  showResult("#score-result", result);
  addReport("Оценка выбора", result);
});

one("#service-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const tariffPrices = { 1: 3000, 2: 7200, 3: 15000 };
  const tariffNames = { 1: "Базовый", 2: "Комфорт", 3: "Премиум" };
  const tariff = field(form, "tariff").value;
  const days = Number(field(form, "days").value);
  const urgent = field(form, "urgent").checked;
  const total = tariffPrices[tariff] * days + (urgent ? 6000 : 0);
  const result = `Тариф «${tariffNames[tariff]}», срок ${days} дн., срочность: ${urgent ? "да" : "нет"}.\nСтоимость: ${tenge(total)}.`;
  showResult("#service-result", result);
  addReport("Расчёт сервисной услуги", result);
});

one("#eligibility-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const age = Number(field(form, "age").value);
  const active = field(form, "status").value === "active";
  const ageCategory = age < 14
    ? "До 14 лет — покупка только вместе с родителем."
    : age < 18
      ? "14–17 лет — для оформления договора нужен взрослый."
      : age < 60
        ? "18–59 лет — можно самостоятельно оформить покупку и услуги."
        : "60 лет и старше — доступна консультация по настройке смартфона.";
  const result = `${ageCategory}\n${age >= 18 && active
    ? "Услуга доступна: можно оформить рассрочку."
    : "Услуга недоступна: нужны возраст от 18 лет и активный аккаунт."}`;
  showResult("#eligibility-result", result, age >= 18 && active ? "success" : "warning");
  addReport("Возраст и доступ к услуге", result);
});

one("#login-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const valid = field(form, "login").value.trim() === "smart"
    && field(form, "password").value === "phone2026";
  const result = valid
    ? "Доступ администратора открыт. Вы можете управлять публикациями."
    : "Предупреждение: неверный логин или пароль. Доступ не предоставлен.";
  isAdminAuthenticated = valid;
  one("#admin-nav").hidden = !valid;
  one("#open-admin").hidden = !valid;
  showResult("#login-result", result, valid ? "success" : "danger");
  addReport("Проверка доступа", result);
  if (valid) {
    showView("admin");
    if (postsLoadError) showResult("#admin-message", postsLoadError, "warning");
    else showResult("#admin-message", "Вы вошли. Создайте публикацию с помощью формы.", "success");
  } else if (one("#view-admin").classList.contains("active")) {
    showView("account");
  }
});

one("#open-admin").addEventListener("click", () => showView("admin"));

one("#post-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!isAdminAuthenticated) {
    showView("account");
    showResult("#login-result", "Сначала войдите под демо-аккаунтом администратора.", "warning");
    return;
  }
  const form = event.currentTarget;
  const type = field(form, "type").value;
  const title = field(form, "title").value.trim();
  const text = field(form, "text").value.trim();
  let mediaUrl = field(form, "mediaUrl").value.trim();
  if ((type === "photo" || type === "video") && !mediaUrl) {
    showResult("#admin-message", "Для публикации фото или видео укажите ссылку на медиафайл.", "warning");
    return;
  }
  if (mediaUrl) {
    try {
      const parsedUrl = new URL(mediaUrl);
      if (!["http:", "https:"].includes(parsedUrl.protocol)) throw new Error("Недопустимый протокол ссылки.");
      mediaUrl = parsedUrl.href;
    } catch {
      showResult("#admin-message", "Укажите корректную ссылку, начинающуюся с http:// или https://.", "danger");
      return;
    }
  }
  const existingPost = posts.find((post) => post.id === editingPostId);
  const post = {
    id: editingPostId || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    type,
    title,
    text,
    mediaUrl,
    featured: field(form, "featured").checked,
    createdAt: existingPost ? existingPost.createdAt : new Date().toISOString()
  };
  const wasEditing = Boolean(editingPostId);
  const updatedPosts = editingPostId
    ? posts.map((item) => item.id === editingPostId ? post : item)
    : [post, ...posts];
  const nextPosts = post.featured
    ? updatedPosts.map((item) => item.id === post.id ? item : { ...item, featured: false })
    : updatedPosts;
  if (savePosts(nextPosts)) {
    resetPostForm();
    renderPosts();
    showResult("#admin-message", wasEditing ? "Изменения сохранены." : "Публикация добавлена.", "success");
  }
});

one("#cancel-edit").addEventListener("click", resetPostForm);

one("#admin-logout").addEventListener("click", () => {
  isAdminAuthenticated = false;
  one("#admin-nav").hidden = true;
  one("#open-admin").hidden = true;
  one("#login-form").reset();
  showView("account");
  showResult("#login-result", "Вы вышли из админ-панели.", "success");
});

one("#status-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const status = field(event.currentTarget, "status").value;
  const messages = {
    active: "Статус: активный. Аккаунт не заблокирован: доступ к функциям магазина разрешён.",
    inactive: "Статус: неактивный. Активируй аккаунт, чтобы пользоваться услугами.",
    blocked: "Статус: заблокированный. Обратись к сотруднику магазина."
  };
  const result = messages[status];
  showResult("#status-result", result, status === "active" ? "success" : "warning");
  addReport("Проверка статуса аккаунта", result);
});

one("#finance-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const income = Number(field(form, "income").value);
  const expenses = Number(field(form, "expenses").value);
  const balance = income - expenses;
  const status = balance < 0
    ? "расходы превышают доходы"
    : income === 0 || balance < income * 0.2
      ? "небольшой запас средств"
      : "устойчивое финансовое состояние";
  const result = `Доходы: ${rubles(income)}\nРасходы: ${rubles(expenses)}\nОстаток: ${rubles(balance)}\nСтатус: ${status}.`;
  showResult("#finance-result", result, balance < 0 ? "warning" : "success");
  addReport("Финансовый анализ", result);
});

one("#security-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const attempts = Number(field(form, "attempts").value);
  const newDevice = field(form, "newDevice").checked;
  const suspiciousLocation = field(form, "location").checked;
  const amount = Number(field(form, "amount").value);
  let risk = attempts * 2;
  if (newDevice) risk += 2;
  if (suspiciousLocation) risk += 3;
  if (amount > 900000) risk += 2;
  const level = risk >= 7 ? "высокий" : risk >= 4 ? "средний" : "низкий";
  const result = `Уровень риска: ${level} (${risk} баллов).\nУчтено: неудачные попытки входа, новое устройство, местоположение и сумма заказа.`;
  showResult("#security-result", result, risk >= 7 ? "danger" : risk >= 4 ? "warning" : "success");
  addReport("Проверка безопасности", result);
});

one("#clear-report").addEventListener("click", () => {
  reportEntries.length = 0;
  renderReport();
});

renderProducts();
posts = readPosts();
renderPosts();
renderReport();
