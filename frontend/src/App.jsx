// App.js
import React, { useState, useEffect } from "react";
import {
  Container,
  Center,
  Button,
  Table,
  Tbody,
  Tr,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import axios from "axios";

function App() {
  const [inventory, setInventory] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    quantity: 0,
    enteredBy: "",
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = () => {
    axios
      .get("http://localhost:5000/items")
      .then((response) => {
        setInventory(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAddItem = () => {
    axios
      .post("http://localhost:5000/items/add", newItem)
      .then((response) => {
        fetchInventory();
        setIsOpen(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteItem = (id) => {
    axios
      .delete(`http://localhost:5000/items/delete/${id}`)
      .then((response) => {
        fetchInventory();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Container
      maxW="container.lg"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
      }}
    >
      <Button onClick={() => setIsOpen(true)}>Add Inventory Item</Button>

      <Table>
        <Tbody>
          {inventory.map((item) => (
            <Tr key={item._id}>
              <Td>{item.name}</Td>
              <Td>{item.category}</Td>
              <Td>{item.quantity}</Td>
              <Td>{item.dateEntered}</Td>
              <Td>{item.enteredBy}</Td>
              <Td>
                <Button onClick={() => handleDeleteItem(item._id)}>
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <Center>
          <ModalContent
            w="400px"
            background="#000"
            borderRadius="12px"
            padding="2rem"
          >
            <ModalHeader fontSize="1.4rem" paddingBottom="1rem">Add Inventory Item</ModalHeader>
            <ModalCloseButton w="10px" right="1rem" position="absolute" />
            <ModalBody>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Category</FormLabel>
                <Input
                  type="text"
                  onChange={(e) =>
                    setNewItem({ ...newItem, category: e.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Quantity</FormLabel>
                <Input
                  type="number"
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      quantity: parseInt(e.target.value),
                    })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Entered By</FormLabel>
                <Input
                  type="text"
                  onChange={(e) =>
                    setNewItem({ ...newItem, enteredBy: e.target.value })
                  }
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleAddItem}>
                Add
              </Button>
              <Button onClick={() => setIsOpen(false)}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Center>
      </Modal>
    </Container>
  );
}

export default App;
