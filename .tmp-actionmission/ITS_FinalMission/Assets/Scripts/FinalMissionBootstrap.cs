using UnityEngine;

public class FinalMissionBootstrap : MonoBehaviour
{
    private void Start()
    {
        if (FindObjectOfType<FinalMissionGame>() == null)
            gameObject.AddComponent<FinalMissionGame>();
    }
}
