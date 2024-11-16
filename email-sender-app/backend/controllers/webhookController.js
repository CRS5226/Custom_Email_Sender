exports.mailgunWebhook = async (req, res) => {
  const { event, recipient, timestamp } = req.body;

  try {
    // Update the email status based on the event
    if (event === "delivered") {
      await Email.updateOne(
        { recipient_email: recipient },
        { status: "delivered" }
      );
    } else if (event === "opened") {
      await Email.updateOne(
        { recipient_email: recipient },
        { status: "opened" }
      );
    } else if (event === "failed" || event === "bounced") {
      await Email.updateOne(
        { recipient_email: recipient },
        { status: "failed" }
      );
    }

    res.status(200).send("Webhook received");
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).send("Error processing webhook");
  }
};
