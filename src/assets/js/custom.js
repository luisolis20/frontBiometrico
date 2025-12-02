import $ from "jquery";
import store from "@/store";

export default {
  data() {
    return {
      idus: "",
      roles: "",
      emaile: "",
      names: "",
    };
  },
  mounted() {
    
    
  },
  computed: {
    

    rolUsuario() {
      //console.log(store);
      return store.state.role;
    },
    emailUsuario() {
      //console.log(store);
      return store.state.email;
    },
    idUsuario() {
      //console.log(store);
      return store.state.idusu;
    },
    nombreUsuario()  {
      //console.log(store);
      return store.state.name;
    },
    
    mostrarOpciones() {
      //console.log(this.rolUsuario);
      this.roles = this.rolUsuario;
      this.emaile = this.emailUsuario;
      this.idus = this.idUsuario;
      this.names = this.nombreUsuario;
      return this.rolUsuario === "Administrador";
    },
    mostrarOpciones2() {
      //console.log(this.rolUsuario);
      this.roles = this.rolUsuario;
      this.emaile = this.emailUsuario;
      this.idus = this.idUsuario;
      this.names = this.nombreUsuario;
      return ((this.rolUsuario === "Estudiante") || (this.rolUsuario === "Estudiante Graduado"));
    },
    mostrarOpcionesgraduado() {
      //console.log(this.rolUsuario);
      this.roles = this.rolUsuario;
      this.emaile = this.emailUsuario;
      this.idus = this.idUsuario;
      this.names = this.nombreUsuario;
      return this.rolUsuario === "Estudiante Graduado";
    },
  },
  methods: {
    
  },
};
