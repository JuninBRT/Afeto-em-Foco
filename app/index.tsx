import { zodResolver } from '@hookform/resolvers/zod';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, Linking, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { TextInput, Button, RadioButton, Checkbox } from 'react-native-paper';
import { z } from 'zod';

import { Container } from '~/components/Container';
import { ScreenContent } from '~/components/ScreenContent';

// Validação com Zod
const FORM_SCHEMA = z.object({
  fullName: z.string().min(1, 'Nome completo é obrigatório'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  email: z.string().email('E-mail inválido'),
  address: z.string().optional(),
  birthDate: z.string().optional(),
  participants: z
    .number()
    .int('Número de participantes deve ser um número inteiro')
    .positive('Número de participantes deve ser positivo'),
  childrenCount: z.number().int().optional(),
  childrenAge: z.string().optional(),
  petsCount: z.number().int().optional(),
  petTypes: z.array(z.string()).optional(),
  pet: z.boolean(),
  additionalNotes: z.string().optional(),
  sessionType: z.string().min(1, 'Tipo de sessão é obrigatório'),
  sessionDateTime: z.string().min(1, 'Data e horário são obrigatórios'),
  sessionLocation: z.string().min(1, 'Local do ensaio é obrigatório'),
  preferences: z.string().optional(),
});

const FormComponent = () => {
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [sessionDate, setSessionDate] = useState('');
  const [isExternal, setIsExternal] = useState(false); // Estado para controlar a exibição do campo de endereço externo
  const [selectedPets, setSelectedPets] = useState<string[]>([]);

  const togglePetType = (type: any) => {
    setSelectedPets((prev) =>
      prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]
    );
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(FORM_SCHEMA),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      address: '',
      birthDate: '',
      participants: 1,
      childrenCount: 0,
      childrenAge: '',
      petsCount: 0,
      petTypes: [],
      additionalNotes: '',
      sessionType: '',
      sessionDateTime: '',
      sessionLocation: '',
      preferences: '',
    },
  });

  const onSubmit = (data: {
    fullName: any;
    phone: any;
    email: any;
    address: any;
    birthDate: any;
    participants: any;
    childrenCount: any;
    childrenAge: any;
    petsCount: any;
    petTypes: any;
    additionalNotes: any;
    sessionType: any;
    sessionDateTime: any;
    sessionLocation: any;
    preferences: any;
  }) => {
    const message = `
      Olá! Aqui estão os dados do formulário:
      - Nome Completo: ${data.fullName}
      - Telefone: ${data.phone}
      - E-mail: ${data.email}
      - Endereço: ${data.address || 'Não informado'}
      - Data de Nascimento: ${data.birthDate || 'Não informado'}
      - Número de Participantes: ${data.participants}
      - Quantidade de Crianças: ${data.childrenCount || 'Nenhuma'}
      - Idade das Crianças: ${data.childrenAge || 'Não informado'}
      - Quantidade de Pets: ${data.petsCount || 'Nenhum'}
      - Tipos de Pets: ${selectedPets.length ? selectedPets.join(', ') : 'Nenhum'}
      - Nota Adicional: ${data.additionalNotes || 'Nenhuma'}
      
      Detalhes do Ensaio:
      - Tipo de Sessão: ${data.sessionType}
      - Data e Horário: ${data.sessionDateTime}
      - Local do Ensaio: ${isExternal ? `Externo - ${data.address}` : 'Estúdio'}
      - Preferências: ${data.preferences || 'Nenhuma'}
    `;

    const whatsappNumber = '5511981296861'; // Substitua pelo número do WhatsApp para onde enviar a mensagem
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    Linking.canOpenURL(whatsappURL)
      .then((supported) => {
        if (supported) {
          Linking.openURL(whatsappURL);
        } else {
          alert('Não foi possível abrir o WhatsApp.');
        }
      })
      .catch((err) => alert(err.message));
  };

  const handleDateConfirm = (date: { toISOString: () => string }) => {
    const formattedDate = date.toISOString().slice(0, 16).replace('T', ' ');
    setSessionDate(formattedDate);
    setValue('sessionDateTime', formattedDate);
    setDatePickerVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Conte para nós as seguintes informações</Text>

      <Controller
        name="fullName"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Nome Completo"
            value={value}
            onChangeText={onChange}
            error={!!errors.fullName}
            style={styles.input}
          />
        )}
      />
      {errors.fullName && <Text style={styles.error}>{errors.fullName.message}</Text>}

      <Controller
        name="phone"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Telefone"
            value={value}
            onChangeText={onChange}
            keyboardType="phone-pad"
            error={!!errors.phone}
            style={styles.input}
          />
        )}
      />
      {errors.phone && <Text style={styles.error}>{errors.phone.message}</Text>}

      <Controller
        name="email"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="E-mail"
            value={value}
            onChangeText={onChange}
            keyboardType="email-address"
            error={!!errors.email}
            style={styles.input}
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <Controller
        name="address"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Endereço (Opcional)"
            value={value}
            onChangeText={onChange}
            style={styles.input}
          />
        )}
      />

      <Controller
        name="sessionType"
        control={control}
        render={({ field: { onChange, value } }) => (
          <RadioButton.Group onValueChange={onChange} value={value}>
            <Text className="mb-2 text-lg font-medium">Tipo de Sessão</Text>
            <RadioButton.Item label="Gestante" value="Gestante" />
            <RadioButton.Item label="Aniversário" value="Aniversário" />
            <RadioButton.Item label="Natal" value="Natal" />
            <RadioButton.Item label="Família" value="Família" />
            <RadioButton.Item label="Newborn" value="Newborn" />
          </RadioButton.Group>
        )}
      />
      {errors.sessionType && <Text style={styles.error}>{errors.sessionType.message}</Text>}

      <Button onPress={() => setDatePickerVisible(true)} style={styles.dateButton}>
        {sessionDate ? `Data escolhida: ${sessionDate}` : 'Selecionar Data do Ensaio'}
      </Button>
      <DateTimePickerModal
        isVisible={datePickerVisible}
        mode="datetime"
        onConfirm={handleDateConfirm}
        onCancel={() => setDatePickerVisible(false)}
      />
      {errors.sessionDateTime && <Text style={styles.error}>{errors.sessionDateTime.message}</Text>}

      {/* Número de Participantes */}
      <Controller
        name="participants"
        control={control}
        render={({ field: { onChange, value } }) => (
          <View className="mb-4">
            <Text className="text-lg font-medium">Número de Participantes</Text>
            <TextInput
              value={value.toString()}
              onChangeText={(text) => onChange(Number(text))}
              keyboardType="numeric"
              style={styles.input}
            />
            {errors.participants && (
              <Text className="text-red-500">{errors.participants.message}</Text>
            )}
          </View>
        )}
      />

      {/* Quantidade e Idade das Crianças */}
      <Controller
        name="childrenCount"
        control={control}
        render={({ field: { onChange, value } }) => (
          <View className="mb-4">
            <Text className="text-lg font-medium">Quantidade de Crianças</Text>
            <TextInput
              value={value.toString()}
              onChangeText={(text) => onChange(Number(text))}
              keyboardType="numeric"
              style={styles.input}
            />
            {errors.childrenCount && (
              <Text className="text-red-500">{errors.childrenCount.message}</Text>
            )}
          </View>
        )}
      />
      <Controller
        name="childrenAge"
        control={control}
        render={({ field: { onChange, value } }) => (
          <View className="mb-4">
            <Text className="text-lg font-medium">Idade da(s) Crianças</Text>
            <TextInput value={value} onChangeText={onChange} style={styles.input} />
            {errors.childrenAge && (
              <Text className="text-red-500">{errors.childrenAge.message}</Text>
            )}
          </View>
        )}
      />

      {/* Quantidade e Tipos de Pets */}
      <Controller
        name="petsCount"
        control={control}
        render={({ field: { onChange, value } }) => (
          <View className="mb-4">
            <Text className="text-lg font-medium">Quantidade de Pets</Text>
            <TextInput
              value={value.toString()}
              onChangeText={(text) => onChange(Number(text))}
              keyboardType="numeric"
              style={styles.input}
            />
            {errors.petsCount && <Text className="text-red-500">{errors.petsCount.message}</Text>}
          </View>
        )}
      />
      <Text className="mb-2 text-lg font-medium">Tipos de Pets</Text>
      <View className="mb-4 flex flex-row items-center">
        <Checkbox
          status={selectedPets.includes('Cachorro') ? 'checked' : 'unchecked'}
          onPress={() => togglePetType('Cachorro')}
        />
        <Text className="ml-2">Cachorro</Text>
      </View>
      <View className="mb-4 flex flex-row items-center">
        <Checkbox
          status={selectedPets.includes('Gato') ? 'checked' : 'unchecked'}
          onPress={() => togglePetType('Gato')}
        />
        <Text className="ml-2">Gato</Text>
      </View>

      {/* Opções de Local do Ensaio */}
      <Text className="mb-2 text-lg font-medium">Local do Ensaio</Text>
      <View className="mb-4 flex flex-row items-center">
        <Checkbox
          status={!isExternal ? 'checked' : 'unchecked'}
          onPress={() => {
            setIsExternal(false);
            setValue('sessionLocation', 'Estúdio');
          }}
        />
        <Text className="ml-2">Estúdio</Text>
      </View>
      <View className="mb-4 flex flex-row items-center">
        <Checkbox
          status={isExternal ? 'checked' : 'unchecked'}
          onPress={() => {
            setIsExternal(true);
            setValue('sessionLocation', 'Externo');
          }}
        />
        <Text className="ml-2">Externo</Text>
      </View>

      {/* Campo de Endereço, exibido apenas se Externo for selecionado */}
      {isExternal && (
        <Controller
          name="address"
          control={control}
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              <TextInput
                label="Endereço"
                value={value}
                onChangeText={onChange}
                className="bg-white text-left"
              />
              {errors.address && <Text className="text-red-500">{errors.address.message}</Text>}
            </View>
          )}
        />
      )}

      <Controller
        name="preferences"
        control={control}
        render={({ field: { onChange, value } }) => (
          <View>
            <Text className="text-lg font-medium">Preferências ou Referências</Text>
            <TextInput value={value} onChangeText={onChange} multiline style={[styles.input]} />
          </View>
        )}
      />

      <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.submitButton}>
        Fechar Agendamento
      </Button>
    </ScrollView>
  );
};

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Afeto em Foco' }} />
      <Container>
        <ScreenContent path="app/index.tsx" title="Home" />
        <FormComponent />
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'white',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  submitButton: {
    marginTop: 20,
  },
  dateButton: {
    marginBottom: 20,
    marginTop: 20,
    textAlign: 'left',
  },
});
