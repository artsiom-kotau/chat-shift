package by.korona.chatshift.repository;

import by.korona.chatshift.model.Message;

import java.util.List;

public interface MessageRepository {

    List<Message> findLastMessages(int offset, int amount);

    Message saveMessage(Message message);
}
