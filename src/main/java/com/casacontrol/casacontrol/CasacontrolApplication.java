package com.casacontrol.casacontrol;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
@ComponentScan(basePackages = "com.casacontrol.casacontrol")
public class CasacontrolApplication {
    public static void main(String[] args) {
        SpringApplication.run(CasacontrolApplication.class, args);
        System.out.println("🚀 CasaControl Application Started!");
    }
}
