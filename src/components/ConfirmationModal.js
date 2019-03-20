import React from 'react';
import { Box, Modal, Spinner, Button, Text } from 'gestalt';
import { calculatePrice } from '../utils';

const ConfirmationModal = ({
  orderProcessing, cartItems, closeModal, handleSubmitOrder
}) => {
  return (
    <Modal
      accessibilityCloseLabel="close"
      accessibilityModalLabel="Confirm Your Order"
      heading="Confirm Your Order"
      onDismiss={closeModal}
      footer={
        <Box display="flex" marginRight={-1} marginLeft={-1} justifyContent="center">
          <Box padding={1}>
            <Button
              size="lg"
              color="red"
              text="Submit"
              disabled={orderProcessing}
              onClick={handleSubmitOrder}
            />
          </Box>
          <Box padding={1}>
            <Button
              size="lg"
              text="Cancel"
              disabled={orderProcessing}
              onClick={closeModal}
            />
          </Box>
        </Box>
      }
      role="alertdialog"
      size="sm"
    >
      {/* Order Summary */}
      {!orderProcessing && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          direction="column"
          padding={2}
          color="lightWash"
        >
          {cartItems.map(item => (
            <Box key={item._id} padding={1}>
              <Text size="lg" color="red">
                {item.name} X {item.quantity} - ${item.quantity * item.price}
              </Text>
            </Box>
          ))}
          <Box paddingY={2}>
            <Text size="lg" bold>
              Total: {calculatePrice(cartItems)}
            </Text>
          </Box>
        </Box>
      )}
      {/* order Processing Spinner */}
      <Spinner show={orderProcessing} accessibilityLabel="Order Processing Spinner" />
      {orderProcessing && <Text align="center" italic>Submitting Order...</Text>}
    </Modal>
  );
};

export default ConfirmationModal;