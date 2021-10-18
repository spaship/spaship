package io.spaship.operator.type;

public class EventStructure {
    private String uuid;
    private String websiteName;
    private String environmentName;
    private String state;

    EventStructure(String uuid, String websiteName, String environmentName, String state) {
        this.uuid = uuid;
        this.websiteName = websiteName;
        this.environmentName = environmentName;
        this.state = state;
    }

    public static EventStructureBuilder builder() {
        return new EventStructureBuilder();
    }

    public String getUuid() {
        return this.uuid;
    }

    public void setUuid(java.util.UUID uuid) {
        this.uuid = uuid.toString();
    }

    public String getWebsiteName() {
        return this.websiteName;
    }

    public void setWebsiteName(String websiteName) {
        this.websiteName = websiteName;
    }

    public String getEnvironmentName() {
        return this.environmentName;
    }

    public void setEnvironmentName(String environmentName) {
        this.environmentName = environmentName;
    }

    public String getState() {
        return this.state;
    }

    public void setState(String state) {
        this.state = state;
    }

    @Override
    public String toString() {
        return "{"
                + "\"UUID\":\"" + uuid + "\""
                + ", \"websiteName\":\"" + websiteName + "\""
                + ", \"environmentName\":\"" + environmentName + "\""
                + ", \"state\":\"" + state + "\""
                + "}";
    }

    public static class EventStructureBuilder {
        private String uuid;
        private String websiteName;
        private String environmentName;
        private String state;

        EventStructureBuilder() {
        }

        public EventStructureBuilder uuid(java.util.UUID uuid) {
            this.uuid = uuid.toString();
            return this;
        }

        public EventStructureBuilder websiteName(String websiteName) {
            this.websiteName = websiteName;
            return this;
        }

        public EventStructureBuilder environmentName(String environmentName) {
            this.environmentName = environmentName;
            return this;
        }

        public EventStructureBuilder state(String state) {
            this.state = state;
            return this;
        }

        public EventStructure build() {
            return new EventStructure(uuid, websiteName, environmentName, state);
        }

        @Override
        public String toString() {
            return "{"
                    + "\"UUID\":\"" + uuid + "\""
                    + ", \"websiteName\":\"" + websiteName + "\""
                    + ", \"environmentName\":\"" + environmentName + "\""
                    + ", \"state\":\"" + state + "\""
                    + "}";
        }
    }
}
