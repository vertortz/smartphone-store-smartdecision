import java.util.Scanner;

public class Validation {
    private final Scanner scanner;

    public Validation(Scanner scanner) {
        this.scanner = scanner;
    }

    public String readRequiredText(String prompt) {
        while (true) {
            System.out.print(prompt);
            String value = scanner.nextLine().trim();
            if (!value.isEmpty()) {
                return value;
            }
            System.out.println("Ошибка: значение не должно быть пустым. Повторите ввод.");
        }
    }

    public int readInt(String prompt, int minimum, int maximum) {
        while (true) {
            System.out.print(prompt);
            String value = scanner.nextLine().trim();
            try {
                int number = Integer.parseInt(value);
                if (number >= minimum && number <= maximum) {
                    return number;
                }
            } catch (NumberFormatException ignored) {
                // The input is reported below and requested again.
            }
            System.out.printf("Ошибка: введите целое число от %d до %d.%n", minimum, maximum);
        }
    }

    public double readDouble(String prompt, double minimum, double maximum) {
        while (true) {
            System.out.print(prompt);
            String value = scanner.nextLine().trim().replace(',', '.');
            try {
                double number = Double.parseDouble(value);
                if (Double.isFinite(number) && number >= minimum && number <= maximum) {
                    return number;
                }
            } catch (NumberFormatException ignored) {
                // The input is reported below and requested again.
            }
            System.out.printf("Ошибка: введите число от %.0f до %.0f.%n", minimum, maximum);
        }
    }

    public boolean readYesNo(String prompt) {
        while (true) {
            String value = readRequiredText(prompt + " (д/н): ");
            if (value.equalsIgnoreCase("д") || value.equalsIgnoreCase("да")
                    || value.equalsIgnoreCase("y") || value.equalsIgnoreCase("yes")) {
                return true;
            }
            if (value.equalsIgnoreCase("н") || value.equalsIgnoreCase("нет")
                    || value.equalsIgnoreCase("n") || value.equalsIgnoreCase("no")) {
                return false;
            }
            System.out.println("Ошибка: введите «д»/«н» или y/n.");
        }
    }
}
