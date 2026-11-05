public class Menu {
    private static final String DEMO_LOGIN = "smart";
    private static final String DEMO_PASSWORD = "phone2026";

    private final Validation validation;
    private final DecisionSystem decisionSystem;
    private final Report report;

    public Menu(Validation validation, DecisionSystem decisionSystem, Report report) {
        this.validation = validation;
        this.decisionSystem = decisionSystem;
        this.report = report;
    }

    public void run() {
        boolean running = true;
        while (running) {
            printMenu();
            int choice = validation.readInt("Выберите пункт: ", 0, 9);
            switch (choice) {
                case 1 -> checkAccess();
                case 2 -> showCategory();
                case 3 -> calculateDiscount();
                case 4 -> checkFinances();
                case 5 -> recommendPhone();
                case 6 -> checkAgeAndService();
                case 7 -> calculateService();
                case 8 -> checkSecurity();
                case 9 -> report.print();
                case 0 -> {
                    report.print();
                    System.out.println("Спасибо за посещение магазина. До свидания!");
                    running = false;
                }
                default -> System.out.println("Неизвестный пункт. Попробуйте ещё раз.");
            }
        }
    }

    private void printMenu() {
        System.out.println("\n========== SMARTPHONE STORE ==========");
        System.out.println("1. Вход и проверка статуса покупателя");
        System.out.println("2. Каталог и категории услуг");
        System.out.println("3. Расчёт скидки и проверка покупки");
        System.out.println("4. Анализ финансового состояния");
        System.out.println("5. Подбор смартфона и оценка результата");
        System.out.println("6. Возраст и доступ к услуге");
        System.out.println("7. Калькулятор сервисных услуг");
        System.out.println("8. Проверка безопасности заказа");
        System.out.println("9. Итоговый отчёт");
        System.out.println("0. Выход");
        System.out.println("======================================");
    }

    private void checkAccess() {
        System.out.println("\n--- Вход в систему ---");
        String login = validation.readRequiredText("Логин: ");
        String password = validation.readRequiredText("Пароль: ");
        if (!DEMO_LOGIN.equals(login) || !DEMO_PASSWORD.equals(password)) {
            String result = "Предупреждение: неверный логин или пароль. Доступ не предоставлен.";
            System.out.println(result);
            report.add("Проверка доступа", result);
            return;
        }

        System.out.println("Доступ открыт.");
        int statusChoice = validation.readInt(
                "Статус аккаунта (1 — активный, 2 — неактивный, 3 — заблокированный): ", 1, 3);
        String status = decisionSystem.checkAccountStatus(statusChoice);
        String access = decisionSystem.checkAccountAccess(statusChoice == 3);
        String result = "Статус покупателя: " + status + ". " + access;
        System.out.println(result);
        report.add("Проверка доступа", result);
    }

    private void showCategory() {
        System.out.println("\nКатегории: 1 — смартфоны, 2 — аксессуары, 3 — ремонт, "
                + "4 — обмен устройства, 5 — настройка и поддержка.");
        int category = validation.readInt("Категория: ", 1, 5);
        String result = switch (category) {
            case 1 -> "Смартфоны: базовые модели, устройства среднего класса и флагманы.";
            case 2 -> "Аксессуары: чехлы, защитные стёкла, зарядные устройства и наушники.";
            case 3 -> "Ремонт: диагностика, замена экрана и восстановление устройства.";
            case 4 -> "Обмен: оценка старого смартфона и зачёт его стоимости при покупке.";
            case 5 -> "Настройка: перенос данных, установка приложений и консультация.";
            default -> throw new IllegalStateException("Категория проверена до выбора.");
        };
        System.out.println(result);
        report.add("Выбор категории", result);
    }

    private void calculateDiscount() {
        double amount = validation.readDouble("Сумма покупки (₸): ", 0, 10000000);
        boolean loyalty = validation.readYesNo("Есть карта лояльности?");
        String result = decisionSystem.calculateDiscount(amount, loyalty);
        System.out.println(result);
        System.out.println(decisionSystem.checkPromotionEligibility(amount, loyalty));

        int age = validation.readInt("Возраст покупателя: ", 1, 120);
        boolean active = validation.readYesNo("Аккаунт активен?");
        boolean blocked = validation.readYesNo("Аккаунт заблокирован?");
        double budget = validation.readDouble("Бюджет покупателя (₸): ", 0, 10000000);
        String decision = decisionSystem.analyzePurchase(age, budget, active, blocked, amount, loyalty);
        System.out.println("Решение по покупке: " + decision);
        report.add("Расчёт покупки", result + System.lineSeparator()
                + decisionSystem.checkPromotionEligibility(amount, loyalty) + System.lineSeparator()
                + "Решение: " + decision);
    }

    private void checkFinances() {
        double income = validation.readDouble("Ежемесячный доход (₸): ", 0, 100000000);
        double expenses = validation.readDouble("Ежемесячные расходы (₸): ", 0, 100000000);
        String result = decisionSystem.assessFinances(income, expenses);
        System.out.println(result);
        report.add("Финансовый анализ", result);
    }

    private void recommendPhone() {
        String result = decisionSystem.evaluateCustomerChoice();
        System.out.println(result);
        report.add("Персональная рекомендация смартфона", result);

        int score = validation.readInt("Оцените подходящую модель от 0 до 100: ", 0, 100);
        String evaluation = decisionSystem.assessProductScore(score);
        System.out.println(evaluation);
        report.add("Оценка выбора", evaluation);
    }

    private void checkAgeAndService() {
        int age = validation.readInt("Возраст покупателя: ", 1, 120);
        String ageResult = decisionSystem.checkAge(age);
        boolean active = validation.readYesNo("Аккаунт активен?");
        String serviceResult = decisionSystem.checkServiceEligibility(age, active);
        System.out.println(ageResult);
        System.out.println(serviceResult);
        String result = ageResult + System.lineSeparator() + serviceResult;
        report.add("Возраст и доступ к услуге", result);
    }

    private void calculateService() {
        System.out.println("Тарифы: 1 — Базовый (3 000 ₸/день), "
                + "2 — Комфорт (7 200 ₸/день), 3 — Премиум (15 000 ₸/день).");
        int tariff = validation.readInt("Выберите тариф: ", 1, 3);
        int days = validation.readInt("Срок обслуживания (дней): ", 1, 365);
        boolean urgent = validation.readYesNo("Нужное срочное обслуживание (+6 000 ₸)?");
        String result = decisionSystem.calculateServicePrice(tariff, days, urgent);
        System.out.println(result);
        report.add("Расчёт сервисной услуги", result);
    }

    private void checkSecurity() {
        int failedAttempts = validation.readInt("Неудачные попытки входа (0–10): ", 0, 10);
        boolean newDevice = validation.readYesNo("Вход с нового устройства?");
        boolean suspiciousLocation = validation.readYesNo("Подозрительное местоположение?");
        double amount = validation.readDouble("Сумма заказа (₸): ", 0, 10000000);
        String result = decisionSystem.assessSecurityRisk(
                failedAttempts, newDevice, suspiciousLocation, amount);
        System.out.println(result);
        report.add("Проверка безопасности", result);
    }
}
