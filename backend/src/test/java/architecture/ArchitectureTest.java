package architecture;

import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;
import jakarta.persistence.Entity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RestController;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;
import static com.tngtech.archunit.library.Architectures.layeredArchitecture;

@AnalyzeClasses(packages = "com.chucknorris", importOptions = ImportOption.DoNotIncludeTests.class)
class ArchitectureTest {

    // NAMING TESTS

    @ArchTest
    static final ArchRule servicesShouldBeInServicePackage =
            classes()
                    .that().haveSimpleNameEndingWith("Service")
                    .or().haveSimpleNameEndingWith("ServiceImpl")
                    .should().resideInAPackage("..service..");

    @ArchTest
    static final ArchRule servicePackageContainsOnlyServices =
            classes()
                    .that().resideInAPackage("..service..")
                    .should().haveSimpleNameEndingWith("Service")
                    .orShould().haveSimpleNameEndingWith("ServiceImpl");

    @ArchTest
    static final ArchRule repositoriesShouldBeInRepositoryPackage =
            classes()
                    .that().haveSimpleNameEndingWith("Repository")
                    .or().haveSimpleNameEndingWith("RepositoryImpl")
                    .should().resideInAPackage("..repository..");

    @ArchTest
    static final ArchRule repositoryPackageContainsOnlyRepositories =
            classes()
                    .that().resideInAPackage("..repository..")
                    .should().haveSimpleNameEndingWith("Repository")
                    .orShould().haveSimpleNameEndingWith("RepositoryImpl");

    @ArchTest
    static final ArchRule controllersShouldBeInControllerPackage =
            classes()
                    .that().haveSimpleNameEndingWith("Controller")
                    .should().resideInAPackage("..controller..");

    @ArchTest
    static final ArchRule controllerPackageContainsOnlyControllers =
            classes()
                    .that().resideInAPackage("..controller..")
                    .should().haveSimpleNameEndingWith("Controller");

    @ArchTest
    static final ArchRule dtoNamingConvention =
            classes()
                    .that().haveSimpleNameEndingWith("Dto")
                    .should().resideInAPackage("..dto..");

    @ArchTest
    static final ArchRule dtoPackageContainsOnlyDtos =
            classes()
                    .that().resideInAPackage("..dto..")
                    .should().haveSimpleNameEndingWith("Dto");

    @ArchTest
    static final ArchRule entityNamingConvention =
            classes()
                    .that().haveSimpleNameEndingWith("Entity")
                    .should().resideInAPackage("..entity..");

    @ArchTest
    static final ArchRule entityPackageContainsOnlyEntites =
            classes()
                    .that().resideInAPackage("..entity..")
                    .should().haveSimpleNameEndingWith("Entity");

    // LAYER TESTS

    @ArchTest
    static final ArchRule layeredArchitecture =
            layeredArchitecture()
                    .consideringAllDependencies()
                    .layer("Config").definedBy("..config..")
                    .layer("Controller").definedBy("..controller..")
                    .layer("Service").definedBy("..service..")
                    .layer("Repository").definedBy("..repository..")
                    .whereLayer("Config").mayNotBeAccessedByAnyLayer()
                    .whereLayer("Controller").mayNotBeAccessedByAnyLayer()
                    .whereLayer("Service").mayOnlyBeAccessedByLayers("Controller", "Config")
                    .whereLayer("Repository").mayOnlyBeAccessedByLayers("Service");

    // REPOSITORY ACCESS TESTS

    @ArchTest
    static final ArchRule servicesMustNotDependOnRepositoryImplementations =
            noClasses()
                    .that().resideInAPackage("..service..")
                    .should().dependOnClassesThat().haveSimpleNameEndingWith("Impl");

    // ANNOTATION TESTS

    @ArchTest
    static final ArchRule featureControllersShouldBeAnnotated =
            classes()
                    .that().resideInAPackage("..controller..")
                    .and().resideOutsideOfPackage("..common..")
                    .should().beAnnotatedWith(RestController.class);

    @ArchTest
    static final ArchRule featureServicesShouldBeAnnotated =
            classes()
                    .that().resideInAPackage("..service..")
                    .and().haveSimpleNameEndingWith("ServiceImpl")
                    .and().resideOutsideOfPackage("..common..")
                    .should().beAnnotatedWith(Service.class);

    @ArchTest
    static final ArchRule entitiesShouldBeAnnotated =
            classes()
                    .that().haveSimpleNameEndingWith("Entity")
                    .should().beAnnotatedWith(Entity.class);
}