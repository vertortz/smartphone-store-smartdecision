import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class Report {
    private final List<String> entries = new ArrayList<>();

    public void add(String title, String details) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm"));
        entries.add(String.format("[%s] %s%n%s", timestamp, title, details));
    }

    public void print() {
        System.out.println("\n========== ИТОГОВЫЙ ОТЧЁТ ==========");
        if (entries.isEmpty()) {
            System.out.println("Пока нет выполненных расчётов.");
        } else {
            for (String entry : entries) {
                System.out.println(entry);
                System.out.println("------------------------------------");
            }
        }
        System.out.println("====================================");
    }
}
