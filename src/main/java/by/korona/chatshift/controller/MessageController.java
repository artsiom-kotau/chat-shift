package by.korona.chatshift.controller;

import by.korona.chatshift.model.Message;
import by.korona.chatshift.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageRepository messageRepository;

    @GetMapping
    public List<Message> getLastMessages(@RequestParam int offset, @RequestParam int amount) {
        return messageRepository.findLastMessages(offset, amount);
    }

    @PostMapping
    public Message addMessage(@RequestBody Message message) {
        message.setDate(LocalDateTime.now());
        return messageRepository.saveMessage(message);
    }
}
