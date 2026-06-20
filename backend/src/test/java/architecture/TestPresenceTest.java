package architecture;

import com.tngtech.archunit.core.domain.JavaClass;
import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.Test;

import java.util.Set;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertTrue;

class TestPresenceArchitectureTest {

    private static final String BASE_PACKAGE = "com.chucknorris";

    @Test
    void relevantProductionClassesShouldHaveMatchingTestClasses() {
        JavaClasses productionClasses = new ClassFileImporter()
                .withImportOption(new ImportOption.DoNotIncludeTests())
                .importPackages(BASE_PACKAGE);

        JavaClasses testClasses = new ClassFileImporter()
                .withImportOption(new ImportOption.OnlyIncludeTests())
                .importPackages(BASE_PACKAGE);

        Set<String> existingTestClassNames = testClasses.stream()
                .map(JavaClass::getFullName)
                .collect(Collectors.toSet());

        var missingTestClasses = productionClasses.stream()
                .filter(this::requiresTestClass)
                .map(this::expectedTestClassName)
                .filter(expectedTestClassName -> !existingTestClassNames.contains(expectedTestClassName))
                .sorted()
                .toList();

        assertTrue(
                missingTestClasses.isEmpty(),
                () -> "Missing test classes:\n" + String.join("\n", missingTestClasses)
        );
    }

    private boolean requiresTestClass(JavaClass javaClass) {
        return !isExplicitlyExcluded(javaClass)
                && (
                isController(javaClass)
                        || isService(javaClass)
                        || isRepositoryImpl(javaClass)
                        || isUtilityClass(javaClass)
        );
    }

    private boolean isExplicitlyExcluded(JavaClass javaClass) {
        String simpleName = javaClass.getSimpleName();

        return simpleName.equals("BaseController")
                || simpleName.equals("HealthController");
    }

    private boolean isController(JavaClass javaClass) {
        return javaClass.getSimpleName().endsWith("Controller");
    }

    private boolean isService(JavaClass javaClass) {
        return javaClass.getSimpleName().endsWith("Service");
    }

    private boolean isRepositoryImpl(JavaClass javaClass) {
        return javaClass.getSimpleName().endsWith("RepositoryImpl");
    }

    private boolean isUtilityClass(JavaClass javaClass) {
        return javaClass.getPackageName().contains(".utils");
    }

    private String expectedTestClassName(JavaClass javaClass) {
        return javaClass.getPackageName() + "." + javaClass.getSimpleName() + "Test";
    }
}