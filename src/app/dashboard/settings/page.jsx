"use client";

import { useState, useEffect } from "react";
import { Button, Input, message, Switch, Form } from "antd";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import useFirestore from "@/hooks/useFirestore";

const DashboardSettingsPage = () => {
  const { settings } = useFirestore();

  const [formRequestCooldownSeconds] = Form.useForm();
  const [requestCooldownSeconds, setRequestCooldownSeconds] = useState(0);

  const [formWidgetLink] = Form.useForm();
  const [widgetLink, setWidgetLink] = useState();

  const handleSwitchChange = async (key, checked) => {
    const settingsCollectionRef = collection(db, "settings");
    const snapshot = await getDocs(settingsCollectionRef);

    if (!snapshot.empty) {
      const settingsDocRef = doc(db, "settings", "ZH98PetEAQWOpYzFsTJS");
      try {
        const updatedSettings = {
          ...settings,
          [key]: checked,
        };

        await updateDoc(settingsDocRef, updatedSettings);
      } catch (error) {
        //
      }
    } else {
      //
    }
  };

  const handleFormRequestCooldownSeconds = async (values) => {
    const { requestCooldownSeconds } = values;

    const settingsCollectionRef = collection(db, "settings");
    const snapshot = await getDocs(settingsCollectionRef);
    setLoading(true);
    if (!snapshot.empty) {
      const settingsDocRef = doc(db, "settings", "ZH98PetEAQWOpYzFsTJS");
      try {
        const updatedSettings = { ...settings, requestCooldownSeconds };
        await updateDoc(settingsDocRef, updatedSettings);
        message.success("Cooldown seconds updated successfully!");
      } catch (error) {
        //
        message.error("Failed to update cooldown seconds.");
      }
    } else {
      //
    }
    setLoading(false);
  };

  const handleFormFormWidgetLink = (values) => {
    const { widgetLink } = values;

    navigator.clipboard
      .writeText(widgetLink)
      .then(() => {
        message.success("Copied to clipboard!");
      })
      .catch(() => {
        message.error("Failed to copy!");
      });
  };

  useEffect(() => {
    const origin = window.location.origin;
    // setWidgetLink(`${origin}/widget/playing`);
    formWidgetLink.setFieldsValue({
      widgetLink: `${origin}/widget/playing`,
    });
  }, []);

  useEffect(() => {
    if (settings?.requestCooldownSeconds !== undefined) {
      // setRequestCooldownSeconds(settings?.requestCooldownSeconds);
      formRequestCooldownSeconds.setFieldsValue({
        requestCooldownSeconds: settings?.requestCooldownSeconds,
      });
    }
  }, [settings]);

  return (
    <div className="dashboard-settings fade-in">
      <div className="setting-item">
        <div>
          <h4>Go Live</h4>
          <Switch checked={settings.live} onChange={(checked) => handleSwitchChange("live", checked)} />
        </div>
        <div>
          <p>
            Enable/Disable live status: This setting allows you to toggle the live streaming feature of the application
            on or off. When enabled, users can access live content, while disabling it will restrict users from viewing
            any live broadcasts.
          </p>
        </div>
      </div>
      <div className="setting-item">
        <div>
          <h4>Request</h4>
          <Switch checked={settings.request} onChange={(checked) => handleSwitchChange("request", checked)} />
        </div>
        <div>
          <p>
            Enable/Disable song requests: This feature controls whether users are allowed to submit song requests. By
            toggling this switch, you can manage the interactivity of your platform—enabling it allows users to engage
            by requesting songs, while disabling it removes this option.
          </p>
        </div>
      </div>
      <div className="setting-item">
        <div>
          <h4>Request Cooldown</h4>
          <Switch
            checked={settings.requestCooldown}
            onChange={(checked) => handleSwitchChange("requestCooldown", checked)}
          />
        </div>
        <div>
          <p>
            Setting a request cooldown: This setting determines the time interval that must pass before a user can
            submit another song request. When activated, you can specify the cooldown period (in seconds) to help manage
            the frequency of requests and ensure a smoother experience for all users.
          </p>
        </div>
        {settings.requestCooldown && (
          <Form
            form={formRequestCooldownSeconds}
            onFinish={handleFormRequestCooldownSeconds}
            initialValues={{ requestCooldownSeconds }}
            className="flex gap-[10px]"
          >
            <Form.Item name="requestCooldownSeconds">
              <Input
                type="number"
                placeholder="Enter cooldown seconds"
                autoComplete="off"
                size="large"
                className="!bg-gray-20"
              />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" size="large" className="!bg-neongold">
                Update
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
      <div className="setting-item">
        <div>
          <h4>Widget</h4>
          <Switch checked={settings.widget} onChange={(checked) => handleSwitchChange("widget", checked)} />
        </div>
        <div>
          <p>
            This widget serves as an overlay for OBS (Open Broadcaster Software), allowing streamers to display
            real-time information about the currently playing song while they are live. When activated, it enhances the
            viewer's experience by showcasing the title and artist of the track, ensuring that the audience stays
            informed about the music being played during the stream.
          </p>
        </div>
        {settings.widget && (
          <Form
            form={formWidgetLink}
            onFinish={handleFormFormWidgetLink}
            initialValues={{ widgetLink }}
            className="flex gap-[10px]"
          >
            <Form.Item name="widgetLink">
              <Input
                type="text"
                placeholder="Enter cooldown seconds"
                autoComplete="off"
                size="large"
                readOnly={true}
                className="!bg-gray-20"
              />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" size="large" className="!bg-neongold">
                Copy
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </div>
  );
};

export default DashboardSettingsPage;
