public class DecisionSystem {
    private final Validation validation;

    public DecisionSystem(Validation validation) {
        this.validation = validation;
    }

    public String checkAge(int age) {
        if (age < 14) {
            return "До 14 лет — покупка только вместе с родителем.";
        } else if (age < 18) {
            return "14–17 лет — для оформления договора нужен взрослый.";
        } else if (age < 60) {
            return "18–59 лет — можно самостоятельно оформить покупку и услуги.";
        } else {
            return "60 лет и старше — доступна консультация по настройке смартфона.";
        }
    }

    public String checkAccountStatus(int statusChoice) {
        if (statusChoice == 1) {
            return "Активный";
        } else if (statusChoice == 2) {
            return "Неактивный";
        }
        return "Заблокированный";
    }

    public String checkServiceEligibility(int age, boolean active) {
        if (age >= 18 && active) {
            return "Услуга доступна: можно оформить рассрочку.";
        }
        return "Услуга недоступна: нужны возраст от 18 лет и активный аккаунт.";
    }

    public String checkPromotionEligibility(double purchase, boolean loyaltyMember) {
        if (purchase >= 50000 || loyaltyMember) {
            return "Покупатель получает предложение программы лояльности.";
        }
        return "Для специального предложения нужна покупка от 50 000 руб. или карта лояльности.";
    }

    public String checkAccountAccess(boolean blocked) {
        if (!blocked) {
            return "Аккаунт не заблокирован: доступ к функциям магазина разрешён.";
        }
        return "Аккаунт заблокирован: обратитесь к сотруднику магазина.";
    }

    public String calculateDiscount(double purchase, boolean loyaltyMember) {
        double discountRate;
        if (purchase >= 100000) {
            discountRate = loyaltyMember ? 0.15 : 0.10;
        } else if (purchase >= 50000) {
            discountRate = loyaltyMember ? 0.10 : 0.05;
        } else {
            discountRate = loyaltyMember ? 0.05 : 0;
        }
        double discount = purchase * discountRate;
        return String.format("Скидка: %.0f%% (%.2f руб.). К оплате: %.2f руб.",
                discountRate * 100, discount, purchase - discount);
    }

    public String assessFinances(double income, double expenses) {
        double balance = income - expenses;
        String status;
        if (balance < 0) {
            status = "расходы превышают доходы";
        } else if (income == 0 || balance < income * 0.2) {
            status = "небольшой запас средств";
        } else {
            status = "устойчивое финансовое состояние";
        }
        return String.format("Доходы: %.2f руб.; расходы: %.2f руб.; остаток: %.2f руб. Статус: %s.",
                income, expenses, balance, status);
    }

    public String assessProductScore(int score) {
        if (score >= 85) {
            return "Оценка A — отличный выбор, смартфон соответствует высоким требованиям.";
        } else if (score >= 65) {
            return "Оценка B — хороший выбор, проверьте важные для вас характеристики.";
        } else if (score >= 40) {
            return "Оценка C — базовый вариант, сравните с другими моделями.";
        }
        return "Оценка D — рекомендуем подобрать другую модель.";
    }

    public String assessSecurityRisk(int failedAttempts, boolean newDevice,
                                    boolean suspiciousLocation, double purchaseAmount) {
        int risk = failedAttempts * 2;
        if (newDevice) {
            risk += 2;
        }
        if (suspiciousLocation) {
            risk += 3;
        }
        if (purchaseAmount > 150000) {
            risk += 2;
        }
        String level = risk >= 7 ? "высокий" : risk >= 4 ? "средний" : "низкий";
        return String.format("Уровень риска: %s (балл %d).", level, risk);
    }

    public String recommendSmartphone(int age, double budget, int storageGb,
                                     int batteryHours, int cameraMp, boolean gaming) {
        int score = 0;
        if (budget >= 100000) {
            score += 2;
        } else if (budget >= 50000) {
            score++;
        }
        if (storageGb >= 256) {
            score++;
        }
        if (batteryHours >= 12) {
            score++;
        }
        if (cameraMp >= 50) {
            score++;
        }
        if (gaming) {
            score++;
        }

        String level = score >= 5 ? "высокий" : score >= 3 ? "средний" : "базовый";
        String recommendation;
        if (age < 18) {
            recommendation = "доступный смартфон с родительской помощью при оформлении";
        } else if (budget >= 100000) {
            if (gaming && storageGb >= 256) {
                recommendation = "флагман с мощным процессором и памятью от 256 ГБ";
            } else if (cameraMp >= 50) {
                recommendation = "флагман с продвинутой камерой";
            } else {
                recommendation = "флагман с расширенной гарантией";
            }
        } else if (budget >= 50000) {
            recommendation = gaming
                    ? "производительная модель среднего класса"
                    : "сбалансированная модель с хорошей камерой";
        } else {
            recommendation = "надёжная базовая модель в пределах бюджета";
        }
        return String.format("Итоговый уровень: %s (%d баллов из 6). Рекомендация: %s.",
                level, score, recommendation);
    }

    public String calculateServicePrice(int tariffChoice, int days, boolean urgent) {
        String tariff;
        double dailyPrice;
        switch (tariffChoice) {
            case 1 -> {
                tariff = "Базовый";
                dailyPrice = 500;
            }
            case 2 -> {
                tariff = "Комфорт";
                dailyPrice = 1200;
            }
            case 3 -> {
                tariff = "Премиум";
                dailyPrice = 2500;
            }
            default -> throw new IllegalArgumentException("Неизвестный тариф.");
        }
        double total = dailyPrice * days + (urgent ? 1000 : 0);
        return String.format("Тариф «%s», срок %d дн., срочность: %s. Стоимость: %.2f руб.",
                tariff, days, urgent ? "да" : "нет", total);
    }

    public String analyzePurchase(int age, double budget, boolean active, boolean blocked,
                                  double purchaseAmount, boolean loyaltyMember) {
        if (blocked) {
            return "Покупка приостановлена: аккаунт заблокирован.";
        }
        if (age < 18) {
            return "Для покупки несовершеннолетнему потребуется участие взрослого.";
        }
        if (!active) {
            return "Покупка недоступна: сначала активируйте аккаунт.";
        }
        if (purchaseAmount > budget && !loyaltyMember) {
            return "Сумма превышает бюджет; проверьте рассрочку или выберите другую модель.";
        }
        if (purchaseAmount > budget && loyaltyMember) {
            return "Предложение одобрено условно: проверьте доступность рассрочки.";
        }
        return "Покупка одобрена. " + calculateDiscount(purchaseAmount, loyaltyMember);
    }

    public String evaluateCustomerChoice() {
        int age = validation.readInt("Возраст: ", 1, 120);
        double budget = validation.readDouble("Бюджет (руб.): ", 0, 10000000);
        int storage = validation.readInt("Желаемая память (ГБ, 32–2048): ", 32, 2048);
        int battery = validation.readInt("Важная автономность (часов, 1–48): ", 1, 48);
        int camera = validation.readInt("Минимальное разрешение камеры (Мп, 1–300): ", 1, 300);
        boolean gaming = validation.readYesNo("Планируете играть на смартфоне?");
        return recommendSmartphone(age, budget, storage, battery, camera, gaming);
    }
}
