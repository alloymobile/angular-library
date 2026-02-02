package com.td.plra.persistence.enums;

public enum RateType {
    ULOC("Unsecured Line of Credit"),
    ILOC("Investment Line of Credit");

    private final String description;

    RateType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
