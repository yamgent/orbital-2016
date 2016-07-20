# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160719034722) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "courses", force: :cascade do |t|
    t.string   "name"
    t.string   "code"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "lectures", force: :cascade do |t|
    t.integer  "course_id"
    t.integer  "day"
    t.time     "start_time"
    t.time     "end_time"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
    t.string   "group_number"
  end

  add_index "lectures", ["course_id"], name: "index_lectures_on_course_id", using: :btree

  create_table "tutorials", force: :cascade do |t|
    t.integer  "course_id"
    t.integer  "day"
    t.time     "start_time"
    t.time     "end_time"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.string   "group_number"
    t.integer  "odd_even",            default: 0
    t.boolean  "has_second_tutorial", default: false
    t.integer  "second_day"
    t.time     "second_start_time"
    t.time     "second_end_time"
  end

  add_index "tutorials", ["course_id"], name: "index_tutorials_on_course_id", using: :btree

  create_table "user_course_selections", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "course_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "user_course_selections", ["course_id"], name: "index_user_course_selections_on_course_id", using: :btree
  add_index "user_course_selections", ["user_id"], name: "index_user_course_selections_on_user_id", using: :btree

  create_table "user_tutorial_selections", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "tutorial_id"
    t.integer  "rank"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  add_index "user_tutorial_selections", ["tutorial_id"], name: "index_user_tutorial_selections_on_tutorial_id", using: :btree
  add_index "user_tutorial_selections", ["user_id"], name: "index_user_tutorial_selections_on_user_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "matricNo"
    t.string   "password_digest"
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
    t.boolean  "admin",           default: false
  end

end
