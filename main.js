import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import vertex from "./shaders/vertex.glsl?raw";
import fragment from "./shaders/fragment.glsl?raw";
import GUI from "lil-gui";
import Stats from "stats.js";

class Experience {
    constructor(canvas) {
        window.experience = this;

        this.canvas = canvas;

        this.scene = new THREE.Scene();

        this.setMesh();
        this.setCamera();
        this.setDebug();
        this.events();
        this.setRenderer();
        this.update();
    }

    setMesh() {
        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(1, 1, 32, 32),
            new THREE.ShaderMaterial({
                vertexShader: vertex,
                fragmentShader: fragment,
                uniforms: {
                    uTime: { value: 0.0 },
                    // uResolution: { value: new THREE.Vector4() },
                },
                side: THREE.DoubleSide,
            })
        );

        this.scene.add(mesh);
    }

    setCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );
        this.camera.position.set(0, 0, 1);

        this.controls = new OrbitControls(this.camera, this.canvas);
    }

    events() {
        window.addEventListener("resize", () => {
            this.resize();
        });

        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "hidden") {
                this.clock.stop();
            } else {
                this.clock.start();
            }
        });
    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    setDebug() {
        this.gui = new GUI();
    }

    setRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor("black");
    }

    update() {
        /**
         * Stats
         */
        this.stats = new Stats();
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);

        /**
         * RAF
         */
        this.clock = new THREE.Clock();
        this.previousTime = 0;

        window.requestAnimationFrame(() => {
            this.tick();
        });
    }

    tick() {
        this.stats.begin();

        this.elapsedTime = this.clock.getElapsedTime();
        this.deltaTime = this.elapsedTime - this.previousTime;
        this.previousTime = this.elapsedTime;

        this.renderer.render(this.scene, this.camera);

        this.stats.end();
        window.requestAnimationFrame(() => this.tick());
    }
}

const experience = new Experience(document.querySelector("canvas"));
