
self.addEventListener("message", function(messageEvent) {
    console.log("Handling message event:", messageEvent);
    this.fetch(messageEvent.origin + "/api/v3/api/sys/dbp/study/log", {
        body: JSON.stringify(messageEvent.data),
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        }
    });
});
