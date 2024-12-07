package by.korona.chatshift.repository.impl;

import by.korona.chatshift.model.Message;
import by.korona.chatshift.repository.MessageRepository;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Repository
public class InMemoryMessageRepository implements MessageRepository {

    private final List<Message> messages = Collections.synchronizedList(new ArrayList<>());

    @Override
    public synchronized List<Message> findLastMessages(int offset, int amount) {
        if (offset < 0 || amount < 0 ) {
            throw new IllegalArgumentException("Unable to fetch messages with offset " + offset + " and amount: " + amount);
        }
        if (offset > messages.size()) {
            return Collections.emptyList();
        }
        if (offset + amount > messages.size()) {
            amount = messages.size() - offset;
        }
        return Collections.unmodifiableList(messages.subList(offset, offset + amount));
    }

    @Override
    public synchronized Message saveMessage(Message message) {
        messages.add(message);
        return message;
    }
}
