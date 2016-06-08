class CreateUserCourseSelections < ActiveRecord::Migration
  def change
    create_table :user_course_selections do |t|
      t.belongs_to :user, index: true
      t.belongs_to :course, index: true

      t.timestamps null: false
    end
  end
end
