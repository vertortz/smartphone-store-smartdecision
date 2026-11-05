import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Validation validation = new Validation(scanner);
        DecisionSystem decisionSystem = new DecisionSystem(validation);
        Report report = new Report();
        Menu menu = new Menu(validation, decisionSystem, report);

        System.out.println("============================");
        System.out.println("      SMARTPHONE STORE");
        System.out.println("============================");
        System.out.println("Добро пожаловать в магазин смартфонов!");
        menu.run();
        scanner.close();
    }
}
