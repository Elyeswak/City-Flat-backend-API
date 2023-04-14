import helpMessagDb from '../models/helpmessage.model.js';

export async function createHelpMessage(req, res) {
    try {
      const { message } = req.body;
      const user  = req.user.id;
  
      const helpMessage = new helpMessagDb({ message, user });
     
      await helpMessage.save().then((message)=>{
        res.status(201).json(message);

      }).catch((e)=>{

        res.status(500).json({ message: e.message });
      });
  
      
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }
  
  export async function getHelpMessageById(req, res) {
    try {
      const helpMessage = await helpMessagDb.findById(req.params.param).populate("user");
      if (!helpMessage) {
        return res.status(404).json({ error: "Help message not found" });
      }
  
      res.status(200).json(helpMessage);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }
  
  export async function getAllHelpMessages(req, res) {
    try {
      const helpMessages = await helpMessagDb.find().populate("user");
      res.status(200).json(helpMessages);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }
  
  export async function deleteHelpMessage(req, res) {
    try {
      const helpMessage = await helpMessagDb.findById(req.params.param);
      if (!helpMessage) {
        return res.status(404).json({ error: "Help message not found" });
      }
  
      await helpMessage.remove();
      res.status(200).json({ message: "Help message deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }