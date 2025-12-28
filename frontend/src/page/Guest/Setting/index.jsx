import { useState } from "react"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"

function Settings() {
  const [activeTab, setActiveTab] = useState("profile")

  const [profile, setProfile] = useState({
    name: "Cuong Phung",
    email: "cuong@gmail.com",
    phone: "0123456789",
    address: "Ho Chi Minh City"
  })

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: ""
  })

  const handleProfileChange = e => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handlePasswordChange = e => {
    setPassword({ ...password, [e.target.name]: e.target.value })
  }

  const saveProfile = e => {
    e.preventDefault()
    alert("Profile updated successfully!")
  }

  const changePassword = e => {
    e.preventDefault()
    if (password.new !== password.confirm) {
      alert("New passwords do not match!")
      return
    }
    alert("Password updated successfully!")
  }

  return (
    <>
      <Header />
      <div className="h-16" />

      <div className="px-4 md:px-36 py-10 font-futura-regular h-screen">
        <h1 className="font-frankfurter text-3xl md:text-5xl mb-10 text-center">
          Account Settings
        </h1>

        <div className="flex flex-col md:flex-row gap-10">
          {/* LEFT MENU */}
          <aside className="md:w-64 border h-fit">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full text-left px-5 py-4 border-b 
                ${activeTab === "profile"
                  ? "bg-black text-white font-semibold"
                  : "hover:bg-gray-100"}`}
            >
              Personal Information
            </button>

            <button
              onClick={() => setActiveTab("password")}
              className={`w-full text-left px-5 py-4
                ${activeTab === "password"
                  ? "bg-black text-white font-semibold"
                  : "hover:bg-gray-100"}`}
            >
              Change Password
            </button>
          </aside>

          {/* RIGHT CONTENT */}
          <section className="flex-1 border p-6">
            {activeTab === "profile" && (
              <form onSubmit={saveProfile}>
                <h2 className="font-frankfurter text-xl mb-6">
                  Personal Information
                </h2>

                <div className="space-y-4">
                  <input
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    placeholder="Full name"
                    className="w-full border p-3 outline-none"
                  />

                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    placeholder="Email"
                    className="w-full border p-3 outline-none"
                  />

                  <input
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    placeholder="Phone number"
                    className="w-full border p-3 outline-none"
                  />

                  <input
                    name="address"
                    value={profile.address}
                    onChange={handleProfileChange}
                    placeholder="Address"
                    className="w-full border p-3 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-6 bg-black text-white py-3 px-10 font-frankfurter"
                >
                  Save Changes
                </button>
              </form>
            )}

            {activeTab === "password" && (
              <form onSubmit={changePassword}>
                <h2 className="font-frankfurter text-xl mb-6">
                  Change Password
                </h2>

                <div className="space-y-4">
                  <input
                    type="password"
                    name="current"
                    value={password.current}
                    onChange={handlePasswordChange}
                    placeholder="Current password"
                    className="w-full border p-3 outline-none"
                  />

                  <input
                    type="password"
                    name="new"
                    value={password.new}
                    onChange={handlePasswordChange}
                    placeholder="New password"
                    className="w-full border p-3 outline-none"
                  />

                  <input
                    type="password"
                    name="confirm"
                    value={password.confirm}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    className="w-full border p-3 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-6 border py-3 px-10 font-frankfurter"
                >
                  Update Password
                </button>
              </form>
            )}
          </section>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Settings
