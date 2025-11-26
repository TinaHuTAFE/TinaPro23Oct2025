import * as React from 'react';
import { StyleSheet, View, Alert, Keyboard, ScrollView } from 'react-native';
import {
  Text,
  List,
  Divider,
  TextInput,
  Button,
  IconButton,
  ActivityIndicator,
  Snackbar,
} from 'react-native-paper';

const JSON_URL = 'https://tafeshaun.github.io/RemoteData/tasks.json';

//*SECTION - Task Screen Page
export default function TasksScreen() {
  //NOTE - REMOTE DATA test
  const [remoteTasks, setRemoteTasks] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [snack, setSnack] = React.useState('');
  
  //NOTE - MOCK DATA START
  const [tasks, setTasks] = React.useState([
    { id: 1, text: 'Finish assessment'},
    { id: 2, text: "Review git commits"},
    { id: 3, text: "Test add new task"},
  ]);

  //ANCHOR - Task Add
  const [taskText, setTaskText] = React.useState('');
  const [editingId, setEditId] = React.useState(null);
  const addTask = () => {
    const trimmed = taskText.trim();
    if (!trimmed) {
      Alert.alert('Validation', 'Task cannot be empty.');
      return;
    }
    if (trimmed.length > 30) {
      Alert.alert('Validation', 'Task must be 30 characters or less.');
      return;
    }
    setTasks((prev) => [...prev, { id: Date.now(), text: trimmed }]);
    setTaskText('');
    Keyboard.dismiss();
    setSnack('Task added');
  };

  //ANCHOR - Edit Item
  const startEdit = (item) => {
    setEditId(item.id);
    setTaskText(item.text);
  }

  // ANCHOR - Validation helper 
  // TODO - ADD THIS TO THE OTHER VALIDATION
  const validate = (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
      Alert.alert('Validation', 'Task cannot be empty.');
      return null;
    }
    if (trimmed.length > 30) {
      Alert.alert('Validation', 'Task must be 30 characters or less.');
      return null;
    }
    return trimmed;
  };

  //ANCHOR - Update Task
  const updateTask = () => {
    const trimmed = validate(taskText);
    if(!trimmed) return; //If they made it empty don't do anything
    setTasks((prev) => prev.map((t) => (t.id === editingId ? {...t, text: trimmed} : t)));
    setEditId(null);
    setTaskText('');
    Keyboard.dismiss();
    setSnack('Task updated');
  }

  //ANCHOR - Load Remote data into our APP from the JSON file on gitpages
  const loadRemote = React.useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg('')
      const request = await fetch(JSON_URL, {cache: 'no-store'})
      if(!request.ok) throw new Error(`HTTP ${request.status}`);
      const jsonReq = await request.json();
      const arrReq = Array.isArray(jsonReq) ? jsonReq : [];
      // Clean + store remote tasks
      const cleaned = arrReq.filter(
        (x) => x && typeof x.id !== 'undefined' && typeof x.text === 'string'
      );
      setRemoteTasks(cleaned);
      console.log('REMOTE DATA:', cleaned); 
      //SEARCH HERE?
    }
    catch (e) {
      console.error(e);
      setErrorMsg('USER YOUR APP FAILED: Failed to load remote data');
    }
    finally {
      setLoading(false);
    }
  }, 
  []);
  
  //TEST FETCH on start
  React.useEffect(() => {
    loadRemote();
  },
  [loadRemote]);

  //NOTE - Merge local and remote data
  const merged = [...remoteTasks, ...tasks];

  //ANCHOR - Search filter
  const [q, setQ] = React.useState('');
  const filtered = merged.filter((t) =>
    (t.text ?? '').toLowerCase().includes(q.toLowerCase())
  );

  //ANCHOR - LOADING UI
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator animating size="large" />
        <Text style={styles.marg16}>Loading remote tasks…</Text>
      </View>
    );
  }

  //ANCHOR - UI Return Section
  return(
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text variant='headlineMedium' style={styles.marg16}>
          Tasks List
        </Text>

        {/* ERROR + RETRY */}
        {!!errorMsg && (
          <View style={[styles.formRow, { justifyContent: 'flex-start' }]}>
            <Text style={{ color: 'crimson', flexShrink: 1 }}>{errorMsg}</Text>
            <Button onPress={loadRemote} style={{ marginLeft: 8 }}>
              Retry
            </Button>
          </View>
        )}

        {/* SEARCH BAR */}
        <TextInput 
          label="Search tasks"
          value={q}
          onChangeText={setQ}
          mode="outlined"
          left={<TextInput.Icon icon="magnify" />}
          style={[styles.input, styles.searchInput]}
        />

        {/* TASK FORM */} 
        <View style={styles.formRow}>
          <TextInput 
            label={editingId ? "Edit task" : "Add a task"}
            value={taskText}
            onChangeText={setTaskText}
            mode="outlined"
            left={<TextInput.Icon icon="pencil" />}
            style={styles.input}
            maxLength={30}
          />
          {editingId ? (
            <Button mode="contained" onPress={updateTask} accessibilityLabel='Update Task Button'>
              Update Task
            </Button>
          ) : (
            <Button mode="contained" onPress={addTask} accessibilityLabel='Add Task Button'>
              Add Task
            </Button>
          )}
        </View>

        {/* TASK LIST (Filtered Remote + Local) */}   
        <List.Section>
          {filtered.length === 0 && <Text>No Tasks Added</Text>}
          {filtered.map((item, index) => {
            const isRemote = remoteTasks.some((r) => r.id === item.id);
            return (
              <View key={`${item.id}-${index}`}>
                <List.Item 
                  title={item.text ?? 'Untitled'}
                  description={isRemote ? 'Remote' : 'Local'}
                  onPress={() => {
                    if (!isRemote) startEdit(item);
                  }}
                  left={props => 
                    <IconButton
                      {...props} 
                      icon={
                        isRemote
                          ? 'cloud-outline'
                          : editingId === item.id
                          ? 'pencil'
                          : 'checkbox-blank-circle-outline'
                      }
                      disabled={isRemote}
                    />}
                  accessibilityLabel={`Task ${item.text}`}
                  right={(props) => (
                    isRemote ? null : (
                      <IconButton
                        {...props}
                        icon="delete-outline"
                        onPress={() => setTasks((prev) => prev.filter((t) => t.id !== item.id))}
                      />
                    )
                  )}
                />

                {index < filtered.length - 1 && <Divider style={styles.marg16}/>}
              </View>
            );
          })}
        </List.Section>

        {/* REFRESH + COUNTS */}
        <View style={[styles.formRow, { justifyContent: 'flex-start', marginTop: 8 }]}>
          <Button mode="outlined" onPress={loadRemote} icon="refresh">
            Refresh Remote
          </Button>
          <Text style={{ marginLeft: 8 }}>
            (Remote {remoteTasks.length} • Local {tasks.length})
          </Text>
        </View>
      </ScrollView>

      {/* FEEDBACK SNACKBAR */}
      <Snackbar
        visible={!!snack}
        onDismiss={() => setSnack('')}
        duration={1200}
      >
        {snack}
      </Snackbar>
    </View>
  );
}
//!SECTION

//*SECTION - Styles Section
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  scrollContent: {
    paddingBottom: 40,     // extra space so last items aren't jammed at the bottom
  },
  center: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginBottom: 16
  },
  marg16:{ marginBottom: 16 },
  input: { flex: 1, margin: 5 },
  searchInput: {
    marginTop: 8,
    marginBottom: 24,      // ⬅️ more space between search and Add Task
  },
})
//!SECTION
