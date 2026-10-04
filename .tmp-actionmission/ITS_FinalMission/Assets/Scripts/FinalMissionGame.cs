using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;

public class FinalMissionGame : MonoBehaviour
{
    private enum TargetType { Bacteria, Virus }

    private class Target
    {
        public GameObject root;
        public RectTransform rt;
        public Image image;
        public TargetType type;
        public string disease;
        public float speed;
        public float phase;
        public Vector2 velocity;
        public bool alive = true;
    }

    private class Projectile
    {
        public GameObject root;
        public RectTransform rt;
        public Vector2 velocity;
        public bool alive = true;
    }

    private Canvas canvas;
    private RectTransform arena;
    private RectTransform player;
    private RectTransform weapon;
    private RectTransform boss;
    private Image bossFill;
    private Image populationFill;
    private Text bossText;
    private Text populationText;
    private Text levelText;
    private Text waveText;
    private Text scoreText;
    private Text comboText;
    private Text messageText;
    private Text objectiveText;
    private Text timerText;
    private GameObject overlay;
    private Text overlayTitle;
    private Text overlayBody;
    private Button overlayButton;
    private Image flash;
    private AudioSource music;
    private Sprite whiteSprite;
    private Sprite playerSprite;
    private Sprite bossSprite;
    private Sprite[] targetSprites;

    private readonly List<Target> targets = new List<Target>();
    private readonly List<Projectile> projectiles = new List<Projectile>();

    private int level = 1;
    private int maxLevel = 3;
    private int wave;
    private int totalWaves = 3;
    private int bossHealth = 100;
    private int populationHealth = 100;
    private int score;
    private int combo;
    private int waveTargetsRemaining;
    private int totalTargetsThisWave;
    private float spawnTimer;
    private float wavePauseTimer;
    private float hitFlashTimer;
    private bool intro = true;
    private bool gameOver;
    private bool betweenWaves;
    private bool canShoot = true;
    private Vector2 playerPos = new Vector2(-720, -260);
    private Vector2 mouseArena;
    private float shotCooldown;

    private readonly string[] bacterialDiseases = { "Gonorrea", "Sífilis", "Clamidia" };
    private readonly string[] viralDiseases = { "VIH", "VPH", "Hepatitis B", "Herpes" };

    private readonly Color cyan = new Color(0.16f, 0.88f, 1f);
    private readonly Color cyanSoft = new Color(0.16f, 0.88f, 1f, 0.22f);
    private readonly Color magenta = new Color(1f, 0.20f, 0.62f);
    private readonly Color green = new Color(0.28f, 1f, 0.64f);
    private readonly Color red = new Color(1f, 0.25f, 0.35f);
    private readonly Color panel = new Color(0.025f, 0.045f, 0.085f, 0.94f);

    private void Awake()
    {
        Application.targetFrameRate = 60;
        whiteSprite = MakeWhiteSprite();
        playerSprite = MakeDoctorSprite();
        bossSprite = MakeBossSprite();
        targetSprites = new[] { MakeTargetSprite(0), MakeTargetSprite(1), MakeTargetSprite(2), MakeTargetSprite(3) };
        BuildInterface();
        SetupAudio();
        ShowIntro();
    }

    private void Update()
    {
        if (intro || gameOver) return;

        UpdatePlayerMovement();
        UpdateAim();
        UpdateShooting();
        UpdateTargets();
        UpdateProjectiles();
        UpdateSpawner();
        UpdateWaveState();
        UpdateEffects();
    }

    private void SetupAudio()
    {
        music = gameObject.AddComponent<AudioSource>();
        music.loop = true;
        music.volume = 0.30f;
        music.playOnAwake = false;
        AudioClip clip = Resources.Load<AudioClip>("TensionLoop");
        if (clip != null)
        {
            music.clip = clip;
            music.Play();
        }
    }

    private void BuildInterface()
    {
        GameObject canvasGO = new GameObject("FinalMissionCanvas");
        canvas = canvasGO.AddComponent<Canvas>();
        canvas.renderMode = RenderMode.ScreenSpaceOverlay;
        canvas.sortingOrder = 50;
        CanvasScaler scaler = canvasGO.AddComponent<CanvasScaler>();
        scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
        scaler.referenceResolution = new Vector2(1920, 1080);
        scaler.matchWidthOrHeight = 0.5f;
        canvasGO.AddComponent<GraphicRaycaster>();

        GameObject eventGO = new GameObject("EventSystem");
        eventGO.AddComponent<EventSystem>();
        eventGO.AddComponent<StandaloneInputModule>();

        Image bg = CreateImage("Background", canvas.transform, new Color(0.008f, 0.015f, 0.035f, 1f));
        Stretch(bg.rectTransform);
        CreateGridBackground();
        CreateGlow("TopGlow", canvas.transform, new Vector2(960, 1030), new Vector2(1900, 130), cyanSoft);

        Text title = CreateText("Title", canvas.transform, "MISIÓN FINAL", 38, FontStyle.Bold, Color.white);
        SetRect(title.rectTransform, 50, 1000, 500, 55, TextAnchor.MiddleLeft);
        Text subtitle = CreateText("Subtitle", canvas.transform, "OPERACIÓN ANTIBIÓTICO • FASE DE CONTENCIÓN", 14, FontStyle.Bold, cyan);
        SetRect(subtitle.rectTransform, 52, 968, 650, 30, TextAnchor.MiddleLeft);

        Image bossCard = CreatePanel("BossCard", canvas.transform, new Vector2(1280, 850), new Vector2(570, 150), panel);
        Text bossLabel = CreateText("BossLabel", canvas.transform, "AMENAZA FINAL", 16, FontStyle.Bold, magenta);
        SetRect(bossLabel.rectTransform, 1020, 910, 250, 30, TextAnchor.MiddleLeft);
        bossText = CreateText("BossText", canvas.transform, "NÚCLEO 100 / 100", 15, FontStyle.Bold, Color.white);
        SetRect(bossText.rectTransform, 1430, 910, 350, 30, TextAnchor.MiddleRight);
        CreateBar("BossBar", new Vector2(1020, 865), new Vector2(760, 22), magenta, out bossFill);

        Image popCard = CreatePanel("PopulationCard", canvas.transform, new Vector2(420, 850), new Vector2(760, 150), panel);
        Text popLabel = CreateText("PopulationLabel", canvas.transform, "PROTECCIÓN DE LA POBLACIÓN", 16, FontStyle.Bold, green);
        SetRect(popLabel.rectTransform, 70, 910, 330, 30, TextAnchor.MiddleLeft);
        populationText = CreateText("PopulationText", canvas.transform, "100 / 100", 15, FontStyle.Bold, Color.white);
        SetRect(populationText.rectTransform, 470, 910, 300, 30, TextAnchor.MiddleRight);
        CreateBar("PopulationBar", new Vector2(70, 865), new Vector2(700, 22), green, out populationFill);

        arena = CreatePanel("Arena", canvas.transform, new Vector2(960, 475), new Vector2(1770, 720), new Color(0.01f, 0.025f, 0.055f, 0.94f)).rectTransform;
        arena.name = "GAME ARENA";
        Outline arenaOutline = arena.gameObject.AddComponent<Outline>();
        arenaOutline.effectColor = new Color(cyan.r, cyan.g, cyan.b, 0.30f);
        arenaOutline.effectDistance = new Vector2(2, -2);

        CreateGlow("ArenaGlow", arena, new Vector2(0, 0), new Vector2(1650, 600), new Color(0.02f, 0.5f, 0.8f, 0.035f));

        levelText = CreateText("Level", canvas.transform, "NIVEL 1 / 3", 17, FontStyle.Bold, Color.white);
        SetRect(levelText.rectTransform, 80, 795, 240, 38, TextAnchor.MiddleLeft);
        waveText = CreateText("Wave", canvas.transform, "OLEADA 1 / 3", 17, FontStyle.Bold, cyan);
        SetRect(waveText.rectTransform, 320, 795, 240, 38, TextAnchor.MiddleLeft);
        scoreText = CreateText("Score", canvas.transform, "PUNTAJE 000000", 17, FontStyle.Bold, Color.white);
        SetRect(scoreText.rectTransform, 1540, 795, 280, 38, TextAnchor.MiddleRight);
        comboText = CreateText("Combo", canvas.transform, "COMBO x0", 17, FontStyle.Bold, new Color(1f, 0.85f, 0.25f));
        SetRect(comboText.rectTransform, 1280, 795, 240, 38, TextAnchor.MiddleRight);

        objectiveText = CreateText("Objective", canvas.transform, "DISPARÁ CON EL RATÓN • MUEVETE CON WASD / FLECHAS", 13, FontStyle.Normal, new Color(0.62f, 0.70f, 0.82f));
        SetRect(objectiveText.rectTransform, 90, 145, 760, 30, TextAnchor.MiddleLeft);
        timerText = CreateText("Timer", canvas.transform, "", 13, FontStyle.Bold, new Color(0.72f, 0.80f, 0.90f));
        SetRect(timerText.rectTransform, 1500, 145, 300, 30, TextAnchor.MiddleRight);

        player = CreateImage("Doctor", arena, Color.white).rectTransform;
        player.GetComponent<Image>().sprite = playerSprite;
        player.sizeDelta = new Vector2(150, 180);
        player.anchoredPosition = playerPos;

        weapon = CreateImage("AntibioticWeapon", player, Color.white).rectTransform;
        weapon.GetComponent<Image>().sprite = MakeWeaponSprite();
        weapon.sizeDelta = new Vector2(105, 42);
        weapon.anchoredPosition = new Vector2(70, 12);
        weapon.pivot = new Vector2(0.12f, 0.5f);

        boss = CreateImage("FinalBoss", arena, Color.white).rectTransform;
        boss.GetComponent<Image>().sprite = bossSprite;
        boss.sizeDelta = new Vector2(230, 230);
        boss.anchoredPosition = new Vector2(620, 160);

        Image targetZone = CreateImage("PopulationZone", arena, new Color(green.r, green.g, green.b, 0.055f));
        targetZone.rectTransform.sizeDelta = new Vector2(330, 620);
        targetZone.rectTransform.anchoredPosition = new Vector2(-735, 0);
        Outline zoneOutline = targetZone.gameObject.AddComponent<Outline>();
        zoneOutline.effectColor = new Color(green.r, green.g, green.b, 0.18f);
        zoneOutline.effectDistance = new Vector2(1, -1);

        Text zoneText = CreateText("ZoneText", arena, "ZONA PROTEGIDA", 13, FontStyle.Bold, new Color(green.r, green.g, green.b, 0.65f));
        SetRect(zoneText.rectTransform, 40, 500, 260, 30, TextAnchor.MiddleCenter);
        zoneText.rectTransform.anchoredPosition = new Vector2(-735, 275);

        messageText = CreateText("Message", canvas.transform, "", 18, FontStyle.Bold, Color.white);
        SetRect(messageText.rectTransform, 500, 105, 920, 42, TextAnchor.MiddleCenter);

        flash = CreateImage("Flash", canvas.transform, new Color(1, 1, 1, 0));
        Stretch(flash.rectTransform);
        flash.raycastTarget = false;

        BuildOverlay();
    }

    private void CreateGridBackground()
    {
        for (int i = 0; i < 24; i++)
        {
            Image line = CreateImage("GridH", canvas.transform, new Color(cyan.r, cyan.g, cyan.b, 0.035f));
            SetRect(line.rectTransform, 0, 160 + i * 38, 1920, 1, TextAnchor.MiddleCenter);
        }
        for (int i = 0; i < 40; i++)
        {
            Image line = CreateImage("GridV", canvas.transform, new Color(cyan.r, cyan.g, cyan.b, 0.022f));
            SetRect(line.rectTransform, i * 50, 160, 1, 900, TextAnchor.MiddleCenter);
        }
    }

    private void BuildOverlay()
    {
        overlay = new GameObject("Overlay");
        overlay.transform.SetParent(canvas.transform, false);
        Image shade = overlay.AddComponent<Image>();
        shade.sprite = whiteSprite;
        shade.color = new Color(0.005f, 0.008f, 0.02f, 0.97f);
        Stretch(shade.rectTransform);

        Image card = CreatePanel("OverlayCard", overlay.transform, new Vector2(960, 570), new Vector2(900, 520), new Color(0.025f, 0.05f, 0.10f, 0.98f));
        Outline cardOutline = card.gameObject.GetComponent<Outline>();
        cardOutline.effectColor = new Color(cyan.r, cyan.g, cyan.b, 0.35f);
        cardOutline.effectDistance = new Vector2(2, -2);

        overlayTitle = CreateText("OverlayTitle", overlay.transform, "", 48, FontStyle.Bold, Color.white);
        SetRect(overlayTitle.rectTransform, 520, 650, 880, 75, TextAnchor.MiddleCenter);
        overlayBody = CreateText("OverlayBody", overlay.transform, "", 20, FontStyle.Normal, new Color(0.78f, 0.84f, 0.93f));
        SetRect(overlayBody.rectTransform, 600, 430, 720, 180, TextAnchor.MiddleCenter);

        GameObject btn = new GameObject("OverlayButton");
        btn.transform.SetParent(overlay.transform, false);
        Image bi = btn.AddComponent<Image>(); bi.sprite = whiteSprite; bi.color = new Color(0.08f, 0.42f, 0.52f, 1);
        overlayButton = btn.AddComponent<Button>(); overlayButton.targetGraphic = bi;
        ColorBlock cb = overlayButton.colors; cb.normalColor = new Color(0.08f, 0.42f, 0.52f, 1); cb.highlightedColor = new Color(0.12f, 0.62f, 0.72f, 1); cb.pressedColor = new Color(0.05f, 0.28f, 0.34f, 1); overlayButton.colors = cb;
        SetRect(btn.GetComponent<RectTransform>(), 710, 300, 500, 72, TextAnchor.MiddleCenter);
        Text bt = CreateText("ButtonText", btn.transform, "COMENZAR MISIÓN", 18, FontStyle.Bold, Color.white);
        Stretch(bt.rectTransform); bt.alignment = TextAnchor.MiddleCenter;
        overlay.SetActive(false);
    }

    private void ShowIntro()
    {
        intro = true;
        overlay.SetActive(true);
        overlayTitle.text = "MISIÓN FINAL";
        overlayTitle.color = cyan;
        overlayBody.text = "El Doctor dispone de antibióticos.\n\nLos proyectiles pueden eliminar bacterias, pero no virus.\n\nEn el campo de batalla los objetivos se ven iguales: no recibirás pistas.\n\nSi disparás a un virus, la población pierde protección.\nSi acertás una bacteria, dañás al Boss.\n\nMUEVETE • APUNTA • DISPARA • SOBREVIVE";
        overlayButton.GetComponentInChildren<Text>().text = "INICIAR OPERACIÓN";
        overlayButton.onClick.RemoveAllListeners();
        overlayButton.onClick.AddListener(StartMission);
    }

    private void StartMission()
    {
        overlay.SetActive(false);
        intro = false;
        gameOver = false;
        level = 1;
        wave = 1;
        bossHealth = 100;
        populationHealth = 100;
        score = 0;
        combo = 0;
        ClearTargets();
        ClearProjectiles();
        playerPos = new Vector2(-720, -260);
        player.anchoredPosition = playerPos;
        StartWave();
        UpdateHUD();
    }

    private void StartWave()
    {
        betweenWaves = false;
        spawnTimer = 0.4f;
        waveTargetsRemaining = 7 + level * 2 + wave;
        totalTargetsThisWave = waveTargetsRemaining;
        waveText.text = $"OLEADA {wave} / {totalWaves}";
        levelText.text = $"NIVEL {level} / {maxLevel}";
        messageText.text = "ELIMINÁ LOS OBJETIVOS SIN REVELAR SU NATURALEZA";
    }

    private void UpdatePlayerMovement()
    {
        Vector2 input = new Vector2(Input.GetAxisRaw("Horizontal"), Input.GetAxisRaw("Vertical")).normalized;
        playerPos += input * 430f * Time.deltaTime;
        playerPos.x = Mathf.Clamp(playerPos.x, -790f, 420f);
        playerPos.y = Mathf.Clamp(playerPos.y, -300f, 285f);
        player.anchoredPosition = playerPos;
    }

    private void UpdateAim()
    {
        if (arena == null) return;
        Vector2 local;
        if (RectTransformUtility.ScreenPointToLocalPointInRectangle(arena, Input.mousePosition, null, out local))
        {
            mouseArena = local;
            Vector2 dir = mouseArena - playerPos;
            if (dir.sqrMagnitude > 10f)
            {
                float angle = Mathf.Atan2(dir.y, dir.x) * Mathf.Rad2Deg;
                weapon.localRotation = Quaternion.Euler(0, 0, angle);
            }
        }
    }

    private void UpdateShooting()
    {
        shotCooldown -= Time.deltaTime;
        if (Input.GetMouseButton(0) && shotCooldown <= 0 && canShoot)
        {
            Vector2 dir = (mouseArena - playerPos).normalized;
            if (dir.sqrMagnitude > 0.01f)
            {
                Shoot(dir);
                shotCooldown = 0.16f;
            }
        }
    }

    private void Shoot(Vector2 direction)
    {
        GameObject go = CreateImage("AntibioticProjectile", arena, cyan).gameObject;
        Image im = go.GetComponent<Image>();
        im.sprite = MakeProjectileSprite();
        RectTransform rt = go.GetComponent<RectTransform>();
        rt.sizeDelta = new Vector2(42, 12);
        rt.anchoredPosition = playerPos + direction * 92f;
        rt.localRotation = Quaternion.Euler(0, 0, Mathf.Atan2(direction.y, direction.x) * Mathf.Rad2Deg);
        projectiles.Add(new Projectile { root = go, rt = rt, velocity = direction * 1050f });
    }

    private void UpdateProjectiles()
    {
        for (int i = projectiles.Count - 1; i >= 0; i--)
        {
            Projectile p = projectiles[i];
            if (!p.alive) { RemoveProjectile(i); continue; }
            p.rt.anchoredPosition += p.velocity * Time.deltaTime;
            if (Mathf.Abs(p.rt.anchoredPosition.x) > 900 || Mathf.Abs(p.rt.anchoredPosition.y) > 390)
            {
                RemoveProjectile(i);
                continue;
            }

            for (int t = targets.Count - 1; t >= 0; t--)
            {
                Target target = targets[t];
                if (!target.alive) continue;
                if (Vector2.Distance(p.rt.anchoredPosition, target.rt.anchoredPosition) < 52f)
                {
                    ResolveHit(target);
                    RemoveProjectile(i);
                    break;
                }
            }
        }
    }

    private void ResolveHit(Target target)
    {
        target.alive = false;
        if (target.type == TargetType.Bacteria)
        {
            bossHealth = Mathf.Max(0, bossHealth - 10);
            score += 100 + combo * 20;
            combo++;
            waveTargetsRemaining--;
            ShowMessage($"IMPACTO EFECTIVO  •  +{100 + (combo - 1) * 20} PTS", green);
            StartCoroutine(Impact(target.rt.anchoredPosition, true));
            Destroy(target.root);
            UpdateHUD();
            if (bossHealth <= 0)
            {
                StartCoroutine(Victory());
                return;
            }
        }
        else
        {
            populationHealth = Mathf.Max(0, populationHealth - 20);
            score = Mathf.Max(0, score - 50);
            combo = 0;
            waveTargetsRemaining--;
            ShowMessage($"¡OBJETIVO EQUIVOCADO!  •  Era {target.disease}: un virus", red);
            StartCoroutine(Impact(target.rt.anchoredPosition, false));
            Destroy(target.root);
            UpdateHUD();
            if (populationHealth <= 0)
            {
                StartCoroutine(Defeat("La población perdió toda su protección."));
            }
        }
    }

    private void UpdateTargets()
    {
        for (int i = targets.Count - 1; i >= 0; i--)
        {
            Target t = targets[i];
            if (!t.alive || t.root == null)
            {
                targets.RemoveAt(i);
                continue;
            }
            Vector2 pos = t.rt.anchoredPosition;
            Vector2 toPlayer = (playerPos - pos).normalized;
            Vector2 drift = new Vector2(Mathf.Sin(Time.time * 1.6f + t.phase), Mathf.Cos(Time.time * 1.3f + t.phase)) * 22f;
            pos += (toPlayer * t.speed + drift) * Time.deltaTime;
            t.rt.anchoredPosition = pos;
            t.rt.localRotation = Quaternion.Euler(0, 0, Mathf.Sin(Time.time * 2f + t.phase) * 14f);

            if (pos.x < -665f)
            {
                populationHealth = Mathf.Max(0, populationHealth - 12);
                combo = 0;
                ShowMessage("¡UN OBJETIVO ALCANZÓ LA ZONA PROTEGIDA!", red);
                StartCoroutine(Impact(new Vector2(-670, pos.y), false));
                Destroy(t.root);
                targets.RemoveAt(i);
                waveTargetsRemaining--;
                UpdateHUD();
                if (populationHealth <= 0) StartCoroutine(Defeat("La población quedó expuesta."));
            }
        }
    }

    private void UpdateSpawner()
    {
        if (betweenWaves || gameOver) return;
        if (waveTargetsRemaining <= 0) return;
        spawnTimer -= Time.deltaTime;
        if (spawnTimer <= 0)
        {
            SpawnTarget();
            spawnTimer = Mathf.Max(0.28f, 0.9f - level * 0.12f - wave * 0.08f);
        }
    }

    private void SpawnTarget()
    {
        bool bacteria = Random.value < 0.48f;
        string disease = bacteria ? bacterialDiseases[Random.Range(0, bacterialDiseases.Length)] : viralDiseases[Random.Range(0, viralDiseases.Length)];
        GameObject go = CreateImage("UnknownTarget", arena, Color.white).gameObject;
        Image im = go.GetComponent<Image>();
        im.sprite = targetSprites[Random.Range(0, targetSprites.Length)];
        RectTransform rt = go.GetComponent<RectTransform>();
        rt.sizeDelta = new Vector2(Random.Range(70f, 94f), Random.Range(70f, 94f));
        rt.anchoredPosition = new Vector2(Random.Range(520f, 790f), Random.Range(-290f, 290f));
        float speed = Random.Range(70f, 115f) + level * 16f + wave * 8f;
        targets.Add(new Target
        {
            root = go,
            rt = rt,
            image = im,
            type = bacteria ? TargetType.Bacteria : TargetType.Virus,
            disease = disease,
            speed = speed,
            phase = Random.Range(0f, 20f),
            velocity = Vector2.zero
        });
    }

    private void UpdateWaveState()
    {
        if (gameOver || betweenWaves) return;
        if (waveTargetsRemaining <= 0 && targets.Count == 0)
        {
            if (level == maxLevel && wave == totalWaves)
            {
                if (bossHealth > 0) StartCoroutine(Defeat("Se agotaron las oportunidades antes de destruir el Boss."));
                return;
            }
            betweenWaves = true;
            wavePauseTimer = 1.8f;
            ShowMessage(wave < totalWaves ? "OLEADA SUPERADA • PREPARANDO LA SIGUIENTE" : "NIVEL SUPERADO • PREPARANDO EL SIGUIENTE", cyan);
        }
        if (betweenWaves)
        {
            wavePauseTimer -= Time.deltaTime;
            if (wavePauseTimer <= 0)
            {
                betweenWaves = false;
                if (wave < totalWaves) wave++;
                else { wave = 1; level++; }
                StartWave();
            }
        }
    }

    private IEnumerator Victory()
    {
        gameOver = true;
        canShoot = false;
        ClearTargets();
        ClearProjectiles();
        messageText.text = "NÚCLEO DE LA AMENAZA DESTRUIDO";
        yield return new WaitForSeconds(1.2f);
        overlay.SetActive(true);
        overlayTitle.text = "¡MISIÓN COMPLETADA!";
        overlayTitle.color = green;
        overlayBody.text = "Lograste superar todos los niveles.\n\nEl Doctor utilizó correctamente los antibióticos para eliminar las bacterias.\n\nTambién aprendiste a no confundirlas con virus: VIH, VPH, Hepatitis B y Herpes no se tratan con antibióticos.\n\nPUNTAJE FINAL: " + score.ToString("000000") + "\n\n¡EXCELENTE TRABAJO!";
        overlayButton.GetComponentInChildren<Text>().text = "JUGAR DE NUEVO";
        overlayButton.onClick.RemoveAllListeners();
        overlayButton.onClick.AddListener(StartMission);
    }

    private IEnumerator Defeat(string reason)
    {
        if (gameOver) yield break;
        gameOver = true;
        canShoot = false;
        yield return new WaitForSeconds(0.7f);
        overlay.SetActive(true);
        overlayTitle.text = "MISIÓN FALLIDA";
        overlayTitle.color = red;
        overlayBody.text = reason + "\n\nRecordá: los antibióticos actúan contra bacterias, no contra virus.\n\nVolvé a intentarlo y analizá cada objetivo sin recibir pistas visuales.";
        overlayButton.GetComponentInChildren<Text>().text = "VOLVER A INTENTAR";
        overlayButton.onClick.RemoveAllListeners();
        overlayButton.onClick.AddListener(StartMission);
    }

    private IEnumerator Impact(Vector2 position, bool correct)
    {
        GameObject ring = CreateImage("Impact", arena, correct ? new Color(green.r, green.g, green.b, 0.85f) : new Color(red.r, red.g, red.b, 0.85f)).gameObject;
        RectTransform rt = ring.GetComponent<RectTransform>();
        rt.sizeDelta = new Vector2(20, 20);
        rt.anchoredPosition = position;
        for (int i = 0; i < 12; i++)
        {
            rt.sizeDelta += new Vector2(18, 18);
            Image im = ring.GetComponent<Image>();
            Color c = im.color; c.a *= 0.90f; im.color = c;
            yield return null;
        }
        Destroy(ring);
    }

    private void UpdateEffects()
    {
        if (hitFlashTimer > 0)
        {
            hitFlashTimer -= Time.deltaTime;
            Color c = flash.color; c.a = Mathf.Clamp01(hitFlashTimer * 2.5f); flash.color = c;
        }
        timerText.text = betweenWaves ? "PREPARANDO..." : "OBJETIVOS RESTANTES: " + Mathf.Max(0, waveTargetsRemaining);
    }

    private void ShowMessage(string text, Color color)
    {
        messageText.text = text;
        messageText.color = color;
        hitFlashTimer = 0.18f;
        flash.color = new Color(color.r, color.g, color.b, 0.08f);
    }

    private void UpdateHUD()
    {
        bossFill.fillAmount = bossHealth / 100f;
        populationFill.fillAmount = populationHealth / 100f;
        bossText.text = $"NÚCLEO {bossHealth} / 100";
        populationText.text = $"{populationHealth} / 100";
        comboText.text = $"COMBO x{combo}";
        scoreText.text = $"PUNTAJE {score:000000}";
    }

    private void ClearTargets()
    {
        foreach (Target t in targets) if (t.root != null) Destroy(t.root);
        targets.Clear();
    }

    private void ClearProjectiles()
    {
        foreach (Projectile p in projectiles) if (p.root != null) Destroy(p.root);
        projectiles.Clear();
    }

    private void RemoveProjectile(int index)
    {
        if (index < 0 || index >= projectiles.Count) return;
        if (projectiles[index].root != null) Destroy(projectiles[index].root);
        projectiles.RemoveAt(index);
    }

    private Image CreatePanel(string name, Transform parent, Vector2 center, Vector2 size, Color color)
    {
        Image image = CreateImage(name, parent, color);
        image.rectTransform.sizeDelta = size;
        image.rectTransform.anchoredPosition = center;
        Outline o = image.gameObject.AddComponent<Outline>();
        o.effectColor = new Color(1, 1, 1, 0.05f);
        o.effectDistance = new Vector2(1, -1);
        return image;
    }

    private Image CreateImage(string name, Transform parent, Color color)
    {
        GameObject go = new GameObject(name);
        go.transform.SetParent(parent, false);
        Image image = go.AddComponent<Image>();
        image.sprite = whiteSprite;
        image.color = color;
        image.raycastTarget = false;
        return image;
    }

    private Text CreateText(string name, Transform parent, string content, int size, FontStyle style, Color color)
    {
        GameObject go = new GameObject(name);
        go.transform.SetParent(parent, false);
        Text t = go.AddComponent<Text>();
        t.font = Resources.GetBuiltinResource<Font>("Arial.ttf");
        t.text = content;
        t.fontSize = size;
        t.fontStyle = style;
        t.color = color;
        t.alignment = TextAnchor.MiddleCenter;
        t.horizontalOverflow = HorizontalWrapMode.Wrap;
        t.verticalOverflow = VerticalWrapMode.Overflow;
        t.raycastTarget = false;
        return t;
    }

    private void CreateBar(string name, Vector2 pos, Vector2 size, Color color, out Image fill)
    {
        Image bg = CreateImage(name + "BG", canvas.transform, new Color(0.01f, 0.02f, 0.04f, 0.98f));
        bg.rectTransform.sizeDelta = size;
        bg.rectTransform.anchoredPosition = pos;
        Outline o = bg.gameObject.AddComponent<Outline>(); o.effectColor = new Color(1, 1, 1, 0.08f); o.effectDistance = new Vector2(1, -1);
        fill = CreateImage(name + "Fill", canvas.transform, color);
        fill.rectTransform.sizeDelta = size - new Vector2(6, 6);
        fill.rectTransform.anchoredPosition = pos;
        fill.type = Image.Type.Filled;
        fill.fillMethod = Image.FillMethod.Horizontal;
        fill.fillAmount = 1;
    }

    private void CreateGlow(string name, Transform parent, Vector2 pos, Vector2 size, Color color)
    {
        Image glow = CreateImage(name, parent, color);
        glow.rectTransform.sizeDelta = size;
        glow.rectTransform.anchoredPosition = pos;
    }

    private void SetRect(RectTransform rt, float x, float y, float w, float h, TextAnchor anchor)
    {
        rt.anchorMin = Vector2.zero;
        rt.anchorMax = Vector2.zero;
        rt.pivot = new Vector2(0.5f, 0.5f);
        rt.anchoredPosition = new Vector2(x + w / 2f, y + h / 2f);
        rt.sizeDelta = new Vector2(w, h);
        Text t = rt.GetComponent<Text>(); if (t != null) t.alignment = anchor;
    }

    private void Stretch(RectTransform rt)
    {
        rt.anchorMin = Vector2.zero;
        rt.anchorMax = Vector2.one;
        rt.offsetMin = Vector2.zero;
        rt.offsetMax = Vector2.zero;
    }

    private Sprite MakeWhiteSprite()
    {
        Texture2D tex = new Texture2D(2, 2, TextureFormat.RGBA32, false);
        tex.SetPixels(new[] { Color.white, Color.white, Color.white, Color.white }); tex.Apply();
        return Sprite.Create(tex, new Rect(0, 0, 2, 2), new Vector2(0.5f, 0.5f), 100);
    }

    private Sprite MakeDoctorSprite()
    {
        int w = 160, h = 190; Texture2D tex = NewTexture(w, h);
        for (int y = 20; y < 155; y++) for (int x = 30; x < 130; x++) tex.SetPixel(x, y, new Color(0.85f, 0.93f, 1f, 1));
        Circle(tex, 80, 145, 34, new Color(0.86f, 0.64f, 0.50f, 1));
        Circle(tex, 68, 153, 5, new Color(0.02f, 0.03f, 0.05f, 1)); Circle(tex, 92, 153, 5, new Color(0.02f, 0.03f, 0.05f, 1));
        for (int y = 155; y < 184; y++) for (int x = 45; x < 115; x++) tex.SetPixel(x, y, new Color(0.04f, 0.07f, 0.13f, 1));
        for (int y = 55; y < 135; y++) for (int x = 48; x < 112; x++) if (x < 60 || x > 100 || y < 60) tex.SetPixel(x, y, new Color(0.95f, 0.98f, 1f, 1));
        Circle(tex, 80, 95, 8, cyan);
        tex.Apply();
        return Sprite.Create(tex, new Rect(0, 0, w, h), new Vector2(0.5f, 0.5f), 100);
    }

    private Sprite MakeWeaponSprite()
    {
        int w = 120, h = 50; Texture2D tex = NewTexture(w, h);
        for (int y = 17; y < 33; y++) for (int x = 8; x < 95; x++) tex.SetPixel(x, y, new Color(0.12f, 0.22f, 0.30f, 1));
        for (int y = 10; y < 40; y++) for (int x = 72; x < 90; x++) tex.SetPixel(x, y, new Color(0.20f, 0.60f, 0.70f, 1));
        for (int y = 20; y < 30; y++) for (int x = 90; x < 116; x++) tex.SetPixel(x, y, cyan);
        tex.Apply();
        return Sprite.Create(tex, new Rect(0, 0, w, h), new Vector2(0.08f, 0.5f), 100);
    }

    private Sprite MakeBossSprite()
    {
        int s = 220; Texture2D tex = NewTexture(s, s);
        Vector2 c = new Vector2(110, 110);
        for (int y = 0; y < s; y++) for (int x = 0; x < s; x++)
        {
            float d = Vector2.Distance(new Vector2(x, y), c);
            if (d < 92) tex.SetPixel(x, y, new Color(0.10f + d / 1000f, 0.02f, 0.15f + d / 900f, 1));
            if (d < 72) tex.SetPixel(x, y, new Color(0.30f, 0.02f, 0.24f, 1));
        }
        for (int i = 0; i < 12; i++)
        {
            float a = i * Mathf.PI * 2f / 12f;
            Vector2 p = c + new Vector2(Mathf.Cos(a), Mathf.Sin(a)) * 90;
            Circle(tex, Mathf.RoundToInt(p.x), Mathf.RoundToInt(p.y), 17, magenta);
        }
        Circle(tex, 110, 110, 42, new Color(0.01f, 0.02f, 0.05f, 1));
        Circle(tex, 110, 110, 27, cyan);
        Circle(tex, 110, 110, 11, Color.white);
        tex.Apply();
        return Sprite.Create(tex, new Rect(0, 0, s, s), new Vector2(0.5f, 0.5f), 100);
    }

    private Sprite MakeTargetSprite(int variant)
    {
        int s = 100; Texture2D tex = NewTexture(s, s); Vector2 c = new Vector2(50, 50);
        Color[] colors = { new Color(0.15f, 0.75f, 0.95f, 1), new Color(0.65f, 0.25f, 1f, 1), new Color(1f, 0.35f, 0.55f, 1), new Color(0.35f, 1f, 0.65f, 1) };
        Color baseColor = colors[variant % colors.Length];
        for (int y = 0; y < s; y++) for (int x = 0; x < s; x++)
        {
            float d = Vector2.Distance(new Vector2(x, y), c);
            if (d < 34) tex.SetPixel(x, y, new Color(baseColor.r * 0.6f, baseColor.g * 0.6f, baseColor.b * 0.6f, 1));
            if (d >= 34 && d < 39) tex.SetPixel(x, y, baseColor);
        }
        int spikes = 8 + variant;
        for (int i = 0; i < spikes; i++)
        {
            float a = i * Mathf.PI * 2f / spikes;
            for (int r = 30; r < 48; r++)
            {
                int x = Mathf.RoundToInt(50 + Mathf.Cos(a) * r);
                int y = Mathf.RoundToInt(50 + Mathf.Sin(a) * r);
                if (x >= 0 && x < s && y >= 0 && y < s) tex.SetPixel(x, y, baseColor);
            }
        }
        Circle(tex, 39, 60, 6, Color.white); Circle(tex, 61, 60, 6, Color.white);
        Circle(tex, 39, 60, 2, Color.black); Circle(tex, 61, 60, 2, Color.black);
        tex.Apply();
        return Sprite.Create(tex, new Rect(0, 0, s, s), new Vector2(0.5f, 0.5f), 100);
    }

    private Sprite MakeProjectileSprite()
    {
        int w = 48, h = 14; Texture2D tex = NewTexture(w, h);
        for (int y = 2; y < 12; y++) for (int x = 4; x < 44; x++) tex.SetPixel(x, y, cyan);
        for (int y = 4; y < 10; y++) for (int x = 10; x < 40; x++) tex.SetPixel(x, y, Color.white);
        tex.Apply();
        return Sprite.Create(tex, new Rect(0, 0, w, h), new Vector2(0.1f, 0.5f), 100);
    }

    private Texture2D NewTexture(int w, int h)
    {
        Texture2D tex = new Texture2D(w, h, TextureFormat.RGBA32, false);
        tex.filterMode = FilterMode.Bilinear;
        Color clear = new Color(0, 0, 0, 0);
        for (int y = 0; y < h; y++) for (int x = 0; x < w; x++) tex.SetPixel(x, y, clear);
        return tex;
    }

    private void Circle(Texture2D tex, int cx, int cy, int r, Color color)
    {
        int r2 = r * r;
        for (int y = cy - r; y <= cy + r; y++) for (int x = cx - r; x <= cx + r; x++)
        {
            if (x < 0 || y < 0 || x >= tex.width || y >= tex.height) continue;
            int dx = x - cx, dy = y - cy;
            if (dx * dx + dy * dy <= r2) tex.SetPixel(x, y, color);
        }
    }
}
