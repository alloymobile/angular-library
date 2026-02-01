package com.td.plra.persistence.enums;

public enum ActiveStatus {
    Y("Active"),
    N("Inactive");

    private final String description;

    ActiveStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
